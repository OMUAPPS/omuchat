use std::thread;

use rand::Rng;
use tracing::info;

use crate::{
    python::{self, PythonRuntime},
    LAUNCHER_DIRECTORY,
};

use super::state::{AppState, ServerStatus};

pub async fn handle_runtime_io(
    runtime: &PythonRuntime,
    commands: Vec<String>,
    data_directory: &std::path::PathBuf,
) -> Result<(), String> {
    runtime
        .handle_io(
            &mut runtime
                .execute(commands, data_directory)
                .await
                .expect("Failed to execute"),
            |_, data| {
                println!("{}", String::from_utf8_lossy(data));
                Ok(())
            },
            |_, data| {
                println!("{}", String::from_utf8_lossy(data));
                Ok(())
            },
            tokio::sync::oneshot::channel().1,
            &(),
        )
        .await
        .expect("Failed to handle IO");
    Ok(())
}

pub async fn prepare_libraries(
    runtime: &PythonRuntime,
    data_directory: &std::path::PathBuf,
) -> Result<(), String> {
    info!("Preparing libraries...");
    handle_runtime_io(
        &runtime,
        vec![
            "-m".to_string(),
            "pip".to_string(),
            "install".to_string(),
            "--upgrade".to_string(),
            "pip".to_string(),
        ],
        data_directory,
    )
    .await
    .expect("Failed to upgrade pip");

    handle_runtime_io(
        &runtime,
        vec![
            "-m".to_string(),
            "pip".to_string(),
            "install".to_string(),
            "--upgrade".to_string(),
            "omuserver".to_string(),
        ],
        data_directory,
    )
    .await
    .unwrap();
    Ok(())
}

pub async fn prepare_server() -> anyhow::Result<()> {
    info!("Preparing server...");
    let data = LAUNCHER_DIRECTORY.data_dir().to_path_buf();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python).expect("Failed to create Python runtime");

    prepare_libraries(&runtime, &data).await.unwrap();
    Ok(())
}

pub async fn run_server_internal(app_state: AppState) -> anyhow::Result<()> {
    let token = app_state.token.clone();
    let data = LAUNCHER_DIRECTORY.data_dir().to_path_buf();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python).expect("Failed to create Python runtime");
    handle_runtime_io(
        &runtime,
        vec![
            "-m".to_string(),
            "omuserver".to_string(),
            "--token".to_string(),
            token.unwrap_or_default(),
        ],
        &data,
    )
    .await
    .unwrap();

    info!("Server stopped");
    Ok(())
}

pub fn is_installed() -> bool {
    let data = LAUNCHER_DIRECTORY.data_dir();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    runtimes_folder.exists()
}

pub fn run_server(app_state: AppState) -> anyhow::Result<()> {
    let app_state = app_state.clone();
    thread::spawn(move || {
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(async {
                let server_state = app_state.server_state.clone();
                let window = app_state.window.clone();
                if server_state.lock().unwrap().clone() == ServerStatus::NotInstalled {
                    server_state
                        .lock()
                        .unwrap()
                        .clone_from(&ServerStatus::Installing);
                    prepare_server().await.unwrap();
                    server_state
                        .lock()
                        .unwrap()
                        .clone_from(&ServerStatus::Installed);
                    let _ = window
                        .lock()
                        .unwrap()
                        .as_ref()
                        .unwrap()
                        .emit("server-state", server_state.lock().unwrap().clone());
                }
                run_server_internal(app_state.clone()).await.unwrap();
            });
    });
    Ok(())
}

pub fn is_already_running() -> bool {
    !portpicker::is_free(26423)
}

pub fn get_status() -> ServerStatus {
    let installed = is_installed();
    let running = is_already_running();
    if running {
        ServerStatus::AlreadyRunning
    } else if installed {
        ServerStatus::Installed
    } else {
        ServerStatus::NotInstalled
    }
}

pub fn generate_token() -> String {
    if cfg!(dev) {
        "dev-admin-token".to_string()
    } else {
        rand::thread_rng()
            .sample_iter(&rand::distributions::Alphanumeric)
            .take(32)
            .map(char::from)
            .collect::<String>()
    }
}
