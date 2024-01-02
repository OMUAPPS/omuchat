use tokio::fs;
use tracing::info;

use crate::{
    python::{self, PythonRuntime},
    util::{download_file, zip_extract},
    LAUNCHER_DIRECTORY,
};

pub async fn handle_runtime_io(
    runtime: &PythonRuntime,
    commands: Vec<String>,
    data_directory: &std::path::PathBuf,
) -> Result<(), String> {
    runtime
        .handle_io(
            &mut runtime
                .execute(commands, data_directory)
                .await
                .expect("Failed to execute"),
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
    Ok(())
}

pub async fn prepare_plugins(plugins_folder: &std::path::PathBuf) -> Result<(), String> {
    fs::create_dir_all(&plugins_folder).await.unwrap();
    info!("Downloading plugins...");
    fs::create_dir_all(LAUNCHER_DIRECTORY.cache_dir())
        .await
        .unwrap();
    let archive = LAUNCHER_DIRECTORY.cache_dir().join("plugins.tar.gz");
    download_file(
        "https://github.com/OMUCHAT/omuchat-plugins/zipball/master/",
        &archive,
    )
    .await
    .unwrap();
    let cache_plugins_folder = LAUNCHER_DIRECTORY.cache_dir().join("plugins");
    fs::create_dir_all(&cache_plugins_folder).await.unwrap();
    zip_extract(&archive, &cache_plugins_folder).await.unwrap();
    let mut items = std::fs::read_dir(&cache_plugins_folder).unwrap();
    let item = items.next().unwrap().unwrap();
    let item_path = item.path();
    fs::remove_dir_all(&plugins_folder).await.unwrap();
    fs::rename(item_path, &plugins_folder).await.unwrap();
    fs::remove_dir_all(&cache_plugins_folder).await.unwrap();
    Ok(())
}

pub async fn prepare_libraries(
    runtime: &PythonRuntime,
    data_directory: &std::path::PathBuf,
) -> Result<(), String> {
    info!("Preparing libraries...");
    runtime.set_env("MULTIDICT_NO_EXTENSIONS", "1");
    handle_runtime_io(
        &runtime,
        vec![
            "-m".to_string(),
            "pip".to_string(),
            "install".to_string(),
            "--upgrade".to_string(),
            "pip".to_string(),
        ],
        data_directory,
    )
    .await
    .expect("Failed to upgrade pip");

    handle_runtime_io(
        &runtime,
        vec![
            "-m".to_string(),
            "pip".to_string(),
            "install".to_string(),
            "--upgrade".to_string(),
            "git+https://github.com/OMUCHAT/omu.py.git".to_string(),
            "git+https://github.com/OMUCHAT/server.git".to_string(),
            "git+https://github.com/OMUCHAT/provider.git".to_string(),
            "git+https://github.com/OMUCHAT/omuchat.py.git".to_string(),
        ],
        data_directory,
    )
    .await
    .unwrap();
    Ok(())
}

pub async fn prepare_server() -> anyhow::Result<()> {
    info!("Preparing server...");
    let data = LAUNCHER_DIRECTORY.data_dir().to_path_buf();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python).expect("Failed to create Python runtime");

    let plugins_folder = data.join("plugins");
    prepare_plugins(&plugins_folder).await.unwrap();
    prepare_libraries(&runtime, &data).await.unwrap();
    Ok(())
}

pub async fn run_server_internal() -> anyhow::Result<()> {
    let data = LAUNCHER_DIRECTORY.data_dir().to_path_buf();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    let python = python::download_python(&runtimes_folder)
        .await
        .expect("Failed to download Python");
    let runtime = PythonRuntime::new(python).expect("Failed to create Python runtime");
    handle_runtime_io(
        &runtime,
        vec!["-m".to_string(), "omuserver".to_string()],
        &data,
    )
    .await
    .unwrap();

    info!("Server running");
    Ok(())
}

pub fn check_installed() -> bool {
    let data = LAUNCHER_DIRECTORY.data_dir();
    let runtimes_folder = data.parent().unwrap().join("runtimes");
    runtimes_folder.exists()
}
