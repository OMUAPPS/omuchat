use std::thread;

use local_ip_address::local_ip;
use tauri::{utils::config::AppUrl, Manager, WindowUrl};
use tokio::fs;
use tracing::info;
use window_shadows::set_shadow;

use crate::{
    python::{self, PythonRuntime},
    server,
    util::{download_file, zip_extract},
    LAUNCHER_DIRECTORY,
};

#[derive(serde::Serialize)]
struct ServerState {
    host: String,
    port: u16,
}

#[derive(serde::Serialize)]
struct ShareResponse {
    url: String,
    host: String,
    port: u16,
}

#[tauri::command]
async fn share_url(state: tauri::State<'_, ServerState>) -> Result<ShareResponse, String> {
    Ok(ShareResponse {
        url: format!("http://{}:{}", state.host, state.port),
        host: state.host.clone(),
        port: state.port,
    })
}

#[tauri::command]
async fn run_server() -> Result<(), String> {
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

async fn run_server_internal() -> anyhow::Result<()> {
    info!("Running server...");
    let data = LAUNCHER_DIRECTORY.data_dir();
    let plugins_folder = data.join("plugins");

    if !plugins_folder.exists() {
        fs::create_dir_all(&plugins_folder).await?;
        info!("Downloading plugins...");
        fs::create_dir_all(LAUNCHER_DIRECTORY.cache_dir()).await?;
        let archive = LAUNCHER_DIRECTORY.cache_dir().join("plugins.tar.gz");
        download_file(
            "https://github.com/OMUCHAT/omuchat-plugins/zipball/master/",
            &archive,
        )
        .await?;
        let cache_plugins_folder = LAUNCHER_DIRECTORY.cache_dir().join("plugins");
        fs::create_dir_all(&cache_plugins_folder).await?;
        zip_extract(&archive, &cache_plugins_folder).await?;
        let mut items = std::fs::read_dir(&cache_plugins_folder).unwrap();
        let item = items.next().unwrap()?;
        let item_path = item.path();
        fs::rename(item_path, &plugins_folder).await?;
        fs::remove_dir_all(&cache_plugins_folder).await?;
    }

    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python);
    runtime.set_env("MULTIDICT_NO_EXTENSIONS", "1");
    runtime
        .execute(
            vec![
                "-m".to_string(),
                "pip".to_string(),
                "install".to_string(),
                "--upgrade".to_string(),
                "pip".to_string(),
            ],
            &data,
        )
        .await
        .expect("Failed to upgrade pip");
    runtime
        .handle_io(
            &mut runtime
                .execute(
                    vec![
                        "-m".to_string(),
                        "pip".to_string(),
                        "install".to_string(),
                        "git+https://github.com/OMUCHAT/omu.py.git".to_string(),
                        "git+https://github.com/OMUCHAT/server.git".to_string(),
                        "git+https://github.com/OMUCHAT/provider.git".to_string(),
                        "git+https://github.com/OMUCHAT/omuchat.py.git".to_string(),
                    ],
                    &data,
                )
                .await
                .expect("Failed to start server"),
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
        .expect("Failed to install server");
    runtime
        .handle_io(
            &mut runtime
                .execute(vec!["-m".to_string(), "omuserver".to_string()], &data)
                .await
                .expect("Failed to start server"),
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

    info!("Server running");
    Ok(())
}

#[tauri::command]
async fn delete_runtime() -> Result<(), String> {
    let data = LAUNCHER_DIRECTORY.data_dir();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    fs::remove_dir_all(runtimes_folder).await.unwrap();
    Ok(())
}

pub fn gui_main() {
    let mut context = tauri::generate_context!();

    let host: std::net::IpAddr = local_ip().expect("failed to get local IP");
    let port = if cfg!(dev) {
        5173u16
    } else {
        portpicker::pick_unused_port().expect("failed to find unused port")
    };

    let url = format!("http://{}:{}", host, port).parse().unwrap();
    let window_url = WindowUrl::External(url);
    // rewrite the config so the IPC is enabled on this URL
    context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());
    context.config_mut().build.dev_path = AppUrl::Url(window_url.clone());

    if !cfg!(dev) {
        thread::spawn(move || {
            tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap()
                .block_on(async {
                    run_server_internal().await.unwrap();
                });
        });
    }

    tauri::Builder::default()
        .manage(ServerState {
            host: host.to_string(),
            port,
        })
        .plugin(server::Builder::new(port).build())
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            share_url,
            run_server,
            delete_runtime,
        ])
        // run async run_server() in a background thread
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
