// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Result;
use directories::ProjectDirs;
use once_cell::sync::Lazy;
use reqwest::Client;
use tokio::fs;
use util::download_file;

pub mod app;

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

    // test download: write get checkip.amazonaws.com to runtime folder
    let test_file = runtimes_folder.join("test.txt");
    download_file("https://checkip.amazonaws.com", &test_file).await?;

    Ok(())
}

pub fn main() -> Result<()> {
    println!("{}", LAUNCHER_DIRECTORY.data_dir().display());
    tauri::async_runtime::block_on(setup())?;

    app::gui::gui_main();

    Ok(())
}
