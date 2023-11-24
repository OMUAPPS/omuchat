// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Result;
use directories::ProjectDirs;
use once_cell::sync::Lazy;
use python::PythonRuntime;
use reqwest::Client;
use tokio::fs;

pub mod app;

mod python;
mod util;

static LAUNCHER_DIRECTORY: Lazy<ProjectDirs> =
    Lazy::new(|| match ProjectDirs::from("cc", "OMUCHAT", "Dashboard") {
        Some(proj_dirs) => proj_dirs,
        None => panic!("Failed to get project directories!"),
    });

static APP_USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"),);

/// HTTP Client with launcher agent
static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    let client = reqwest::ClientBuilder::new()
        .user_agent(APP_USER_AGENT)
        .build()
        .unwrap_or_else(|_| Client::new());

    client
});

async fn setup() -> Result<()> {
    let data = LAUNCHER_DIRECTORY.data_dir();
    let runtimes_folder = data.join("runtimes");
    if !runtimes_folder.exists() {
        fs::create_dir_all(&runtimes_folder).await?;
    }

    python::download_python(&runtimes_folder).await?;
    let runtime = PythonRuntime::new(runtimes_folder.join("python-3.12.0/python/python"));
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
        .await?;
    let mut result = runtime
        .execute(
            vec![
                "-m".to_string(),
                "pip".to_string(),
                "install".to_string(),
                "-r".to_string(),
                "requirements.txt".to_string(),
            ],
            &data,
        )
        .await?;
    runtime
        .handle_io(
            &mut result,
            |_, data| {
                println!("stdout: {}", String::from_utf8_lossy(data));
                Ok(())
            },
            |_, data| {
                println!("stderr: {}", String::from_utf8_lossy(data));
                Ok(())
            },
            tokio::sync::oneshot::channel().1,
            &(),
        )
        .await?;

    Ok(())
}

pub fn main() -> Result<()> {
    println!("{}", LAUNCHER_DIRECTORY.data_dir().display());
    tauri::async_runtime::block_on(setup())?;

    app::gui::gui_main();

    Ok(())
}
