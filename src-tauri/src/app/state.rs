use std::sync::{Arc, Mutex};

#[derive(serde::Serialize, PartialEq, Clone)]
pub enum ServerState {
    NotInstalled,
    Installing,
    Installed,
}

#[derive(Clone)]
pub struct AppState {
    pub server_state: Arc<Mutex<ServerState>>,
    pub window: Arc<Mutex<Option<tauri::Window>>>,
}

#[derive(serde::Serialize)]
pub struct ShareState {
    pub host: String,
    pub port: u16,
}
