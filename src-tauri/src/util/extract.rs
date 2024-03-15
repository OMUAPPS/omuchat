use anyhow::Result;
use async_compression::tokio::bufread::GzipDecoder;
use std::path::Path;
use tokio::io::{AsyncRead, AsyncReadExt, AsyncSeek, BufReader};

pub async fn tar_gz_extract<R>(archive: R, out_dir: &Path) -> Result<()>
where
    R: AsyncRead + AsyncSeek + Unpin,
{
    let mut decoder = GzipDecoder::new(BufReader::new(archive));
    let mut decoded_data: Vec<u8> = vec![];
    decoder.read_to_end(&mut decoded_data).await?;

    let mut ar = tokio_tar::Archive::new(&decoded_data[..]);
    ar.unpack(out_dir).await?;
    Ok(())
}
