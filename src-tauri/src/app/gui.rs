use std::{
    sync::{Arc, Mutex},
    thread,
};

use local_ip_address::local_ip;
use tauri::{utils::config::AppUrl, Manager, WindowUrl};
use window_shadows::set_shadow;

use crate::server;

use super::runtime::{check_installed, prepare_server, run_server_internal};
use super::state::{AppState, ServerState, ShareState};

use tokio::fs;
use tracing::info;

use crate::{
    python::{self, PythonRuntime},
    LAUNCHER_DIRECTORY,
};

use super::runtime::prepare_libraries;

#[tauri::command]
pub async fn share_url(state: tauri::State<'_, ShareState>) -> Result<ShareState, String> {
    Ok(ShareState {
        host: state.host.clone(),
        port: state.port,
    })
}

#[tauri::command]
pub async fn run_server() -> Result<(), String> {
    thread::spawn(move || {
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(async {
                run_server_internal().await.unwrap();
            });
    });

    Ok(())
}

#[tauri::command]
pub async fn delete_runtime(app_state: tauri::State<'_, AppState>) -> Result<(), String> {
    let data = LAUNCHER_DIRECTORY.data_dir();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    if runtimes_folder.exists() {
        fs::remove_dir_all(&runtimes_folder).await.unwrap();
    }
    info!("Server deleted");
    app_state
        .server_state
        .lock()
        .unwrap()
        .clone_from(&ServerState::NotInstalled);
    let window = app_state.window.lock().unwrap();
    let _ = window.as_ref().unwrap().emit(
        "server-state",
        app_state.server_state.lock().unwrap().clone(),
    );
    Ok(())
}

#[tauri::command]
pub async fn install_runtime(app_state: tauri::State<'_, AppState>) -> Result<(), String> {
    let server_state = app_state.server_state.clone();
    let window = app_state.window.clone();
    thread::spawn(move || {
        tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap()
            .block_on(async {
                prepare_server().await.unwrap();
                server_state
                    .lock()
                    .unwrap()
                    .clone_from(&ServerState::Installed);

                let window = window.lock().unwrap();
                let _ = window
                    .as_ref()
                    .unwrap()
                    .emit("server-state", server_state.lock().unwrap().clone());
            });
    });
    Ok(())
}

#[tauri::command]
pub async fn get_server_state(state: tauri::State<'_, AppState>) -> Result<ServerState, String> {
    Ok(state.server_state.lock().unwrap().clone())
}

#[tauri::command]
pub async fn update_libraries() -> Result<(), String> {
    let data = LAUNCHER_DIRECTORY.data_dir().to_path_buf();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python).expect("Failed to create Python runtime");
    prepare_libraries(&runtime, &data).await.unwrap();
    Ok(())
}

pub fn gui_main() {
    let mut context = tauri::generate_context!();

    let host: std::net::IpAddr = local_ip().expect("failed to get local IP");
    let port = 26420u16;

    let url = format!("http://{}:{}", host, port).parse().unwrap();
    let window_url = WindowUrl::External(url);
    // rewrite the config so the IPC is enabled on this URL
    context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());
    context.config_mut().build.dev_path = AppUrl::Url(window_url.clone());

    let server_state = if check_installed() {
        ServerState::Installed
    } else {
        ServerState::NotInstalled
    };
    let app_state = AppState {
        server_state: Arc::new(Mutex::new(server_state)),
        window: Arc::new(Mutex::new(None::<tauri::Window>)),
    };

    {
        let server_state = app_state.server_state.clone();
        let window = app_state.window.clone();
        thread::spawn(move || {
            tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap()
                .block_on(async {
                    if server_state.lock().unwrap().clone() == ServerState::NotInstalled {
                        server_state
                            .lock()
                            .unwrap()
                            .clone_from(&ServerState::Installing);
                        prepare_server().await.unwrap();
                        server_state
                            .lock()
                            .unwrap()
                            .clone_from(&ServerState::Installed);
                        let window = window.lock().unwrap();
                        let _ = window
                            .as_ref()
                            .unwrap()
                            .emit("server-state", server_state.lock().unwrap().clone());
                    }
                    run_server_internal().await.unwrap();
                });
        });
    }
    tauri::Builder::default()
        .manage(ShareState {
            host: host.to_string(),
            port,
        })
        .manage(app_state.clone())
        .plugin(server::Builder::new(port).build())
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            app_state.window.lock().unwrap().replace(window.clone());
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            share_url,
            run_server,
            delete_runtime,
            install_runtime,
            get_server_state,
            update_libraries,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
