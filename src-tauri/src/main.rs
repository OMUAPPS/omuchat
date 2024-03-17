// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    fs,
    io::{self},
};

use anyhow::Result;
use directories::ProjectDirs;
use once_cell::sync::Lazy;
use reqwest::Client;
use tracing::debug;
use tracing_subscriber::{fmt, layer::SubscriberExt};

pub mod app;

mod python;
mod server;
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

pub fn main() -> Result<()> {
    let log_folder = LAUNCHER_DIRECTORY.data_dir().join("logs");

    let file_appender = tracing_appender::rolling::hourly(&log_folder, "dashoboard.log");

    let subscriber = tracing_subscriber::registry()
        .with(
            fmt::Layer::new()
                .pretty()
                .with_ansi(true)
                .with_writer(io::stdout),
        )
        .with(
            fmt::Layer::new()
                .with_ansi(false)
                .with_writer(file_appender),
        );
    tracing::subscriber::set_global_default(subscriber).expect("Unable to set a global subscriber");

    debug!("Creating data directories");
    fs::create_dir_all(LAUNCHER_DIRECTORY.data_dir()).expect("Failed to create data directory");
    fs::create_dir_all(LAUNCHER_DIRECTORY.config_dir()).expect("Failed to create config directory");

    app::gui::gui_main();

    Ok(())
}
