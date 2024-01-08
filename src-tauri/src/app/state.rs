use std::sync::{Arc, Mutex};

#[derive(serde::Serialize, PartialEq, Clone)]
pub enum ServerStatus {
    NotInstalled,
    Installing,
    Installed,
    AlreadyRunning,
}

#[derive(Clone)]
pub struct AppState {
    pub server_state: Arc<Mutex<ServerStatus>>,
    pub window: Arc<Mutex<Option<tauri::Window>>>,
    pub token: Option<String>,
}

#[derive(serde::Serialize)]
pub struct ShareState {
    pub host: String,
    pub port: u16,
}

#[derive(serde::Serialize)]
pub struct InstallProgress {
    pub progress: f64,
    pub total: f64,
    pub message: String,
}
