use local_ip_address::local_ip;
use tauri::{utils::config::AppUrl, Manager, WindowUrl};
use window_shadows::set_shadow;

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

    tauri::Builder::default()
        .manage(ServerState {
            host: host.to_string(),
            port,
        })
        .plugin(omuchat_tauri_plugin_server::Builder::new(port).build())
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![share_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
