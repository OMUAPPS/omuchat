use std::path::PathBuf;

use anyhow::Result;
use tokio::fs;

use crate::{
    util::{download_file, tar_gz_extract},
    LAUNCHER_DIRECTORY,
};

pub async fn download_python(runtimes_folder: &PathBuf) -> Result<()> {
    let runtime = runtimes_folder.join("python-3.12.0");
    if runtime.exists() {
        return Ok(());
    }
    println!("{}", LAUNCHER_DIRECTORY.cache_dir().display());
    fs::create_dir_all(LAUNCHER_DIRECTORY.cache_dir()).await?;
    let archive = LAUNCHER_DIRECTORY.cache_dir().join("python.tar.gz");
    download_file("https://github.com/indygreg/python-build-standalone/releases/download/20231002/cpython-3.12.0%2B20231002-i686-pc-windows-msvc-static-install_only.tar.gz", &archive).await?;
    tar_gz_extract(fs::File::open(&archive).await?, &runtime).await?;
    fs::remove_file(&archive).await?;
    Ok(())
}
