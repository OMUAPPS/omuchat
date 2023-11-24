use std::path::Path;

use anyhow::Result;
use tokio::fs;

use crate::HTTP_CLIENT;

pub async fn download_file(url: &str, path: impl AsRef<Path>) -> Result<()> {
    let path = path.as_ref().to_owned();
    let response = HTTP_CLIENT.get(url).send().await?.error_for_status()?;

    let content = response.bytes().await?;
    fs::write(path, content).await?;
    Ok(())
}
