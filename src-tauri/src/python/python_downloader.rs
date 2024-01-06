use std::path::PathBuf;

use anyhow::Result;
use tokio::fs;
use tracing::info;

use crate::{
    util::{download_file, tar_gz_extract},
    LAUNCHER_DIRECTORY,
};

pub async fn download_python(runtimes_folder: &PathBuf) -> Result<PathBuf> {
    let runtime = runtimes_folder.join("python-3.12.0");
    let python_path = runtime.join("python").join(if cfg!(target_os = "windows") {
        "python.exe"
    } else {
        "python"
    });
    if runtime.exists() && python_path.exists() {
        info!("Python already downloaded");
        return Ok(python_path);
    }
    // println!("{}", LAUNCHER_DIRECTORY.cache_dir().display());
    info!("Downloading Python 3.12.0 ...");
    fs::create_dir_all(LAUNCHER_DIRECTORY.cache_dir()).await?;
    let archive = LAUNCHER_DIRECTORY.cache_dir().join("python.tar.gz");
    download_file("https://github.com/indygreg/python-build-standalone/releases/download/20231002/cpython-3.12.0%2B20231002-i686-pc-windows-msvc-static-install_only.tar.gz", &archive).await?;
    tar_gz_extract(fs::File::open(&archive).await?, &runtime).await?;
    fs::remove_file(&archive).await?;
    if !python_path.exists() {
        anyhow::bail!("Python executable not found");
    }
    info!("Python 3.12.0 downloaded");
    Ok(python_path)
}
