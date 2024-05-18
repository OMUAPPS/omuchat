use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};

use anyhow::{Error, Result};
use rand::Rng;

use crate::{app::ServerStatus, python::Python, uv::Uv};

const LATEST_PIP: &str = "pip==23.3.2";
const REQUIREMENTS: &str = r#"
omuserver==0.4.2
"#;

pub struct ServerOption {
    pub data_dir: PathBuf,
    pub port: u16,
    pub address: String,
}

pub struct Server {
    option: ServerOption,
    python: Python,
    uv: Uv,
    pub token: Arc<Mutex<Option<String>>>,
    pub child: Arc<Mutex<Option<std::process::Child>>>,
    pub state: Arc<Mutex<ServerStatus>>,
    pub window: Arc<Mutex<Option<tauri::Window>>>,
}

impl Server {
    pub fn new(option: ServerOption, python: Python, uv: Uv) -> Self {
        Self {
            option,
            python,
            uv,
            token: Arc::new(Mutex::new(None)),
            child: Arc::new(Mutex::new(None)),
            state: Arc::new(Mutex::new(ServerStatus::NotInstalled)),
            window: Arc::new(Mutex::new(None)),
        }
    }

    pub fn is_port_in_use(&self) -> bool {
        !portpicker::is_free(self.option.port)
    }

    fn change_state(&self, state: ServerStatus) {
        if let Some(window) = self.window.lock().unwrap().as_ref() {
            window
                .emit("server-state", Some(state.clone()))
                .expect("failed to emit server-state");
        } else {
            println!("window not found");
        }
        *self.state.lock().unwrap() = state;
    }

    pub fn start(&self) -> Result<(), Error> {
        if self.is_port_in_use() {
            // return Err(anyhow!("Port {} is already in use", self.option.port));
            println!("Port {} is already in use", self.option.port);
            self.change_state(ServerStatus::AlreadyRunning);
            return Ok(());
        }
        if !self.option.data_dir.exists() {
            std::fs::create_dir_all(&self.option.data_dir)?;
        }
        self.token
            .lock()
            .unwrap()
            .get_or_insert_with(generate_token);

        self.change_state(ServerStatus::Installing);
        self.uv.update(LATEST_PIP, REQUIREMENTS)?;
        self.change_state(ServerStatus::Installed);
        let mut cmd = self.python.cmd();
        cmd.arg("-m");
        cmd.arg("omuserver");
        cmd.arg("--token");
        cmd.arg(self.token.lock().unwrap().as_ref().unwrap());
        cmd.current_dir(&self.option.data_dir);

        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            // 0x08000000: CREATE_NO_WINDOW https://learn.microsoft.com/ja-jp/windows/win32/procthread/process-creation-flags?redirectedfrom=MSDN#create_no_window
            cmd.creation_flags(0x08000000);
        }

        let child = cmd.spawn()?;
        *self.child.lock().unwrap() = Some(child);
        Ok(())
    }
}

fn generate_token() -> String {
    if cfg!(dev) {
        "dev-token".to_string()
    } else {
        rand::thread_rng()
            .sample_iter(&rand::distributions::Alphanumeric)
            .take(32)
            .map(char::from)
            .collect::<String>()
    }
}
