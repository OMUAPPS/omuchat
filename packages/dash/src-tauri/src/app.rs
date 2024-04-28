use std::sync::{Arc, Mutex};

use crate::server::{self, Server};

#[derive(Clone)]
pub struct AppState {
    pub server: Arc<Mutex<Server>>,
}

impl AppState {
    pub fn new(server: Server) -> Self {
        Self {
            server: Arc::new(Mutex::new(server)),
        }
    }

    pub fn set_window(&self, window: Option<tauri::Window>) {
        let server = self.server.lock();
        match server {
            Ok(server) => server.window.lock().unwrap().replace(window.unwrap()),
            Err(_) => None,
        };
    }

    pub fn get_token(&self) -> Option<String> {
        let server = self.server.lock();
        match server {
            Ok(server) => server.token.lock().unwrap().clone(),
            Err(_) => None,
        }
    }

    pub fn get_server_state(&self) -> ServerStatus {
        let server = self.server.lock();
        match server {
            Ok(server) => server.state.lock().unwrap().clone(),
            Err(_) => ServerStatus::NotInstalled,
        }
    }
}

#[derive(serde::Serialize, PartialEq, Clone)]
pub enum ServerStatus {
    NotInstalled,
    Installing,
    Installed,
    AlreadyRunning,
}
