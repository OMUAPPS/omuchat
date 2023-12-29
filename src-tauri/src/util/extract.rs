use anyhow::Result;
use async_compression::tokio::bufread::GzipDecoder;
use std::{
    fs::{self, File},
    io,
    path::Path,
};
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

pub async fn zip_extract<P: AsRef<Path>, Q: AsRef<Path>>(
    zip_path: P,
    extract_path: Q,
) -> Result<()> {
    let zip_path = zip_path.as_ref();
    let extract_path = extract_path.as_ref();
    let file = File::open(zip_path)?;
    let mut archive = zip::ZipArchive::new(file)?;
    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let outpath = extract_path.join(file.mangled_name());
        if (&*file.name()).ends_with('/') {
            fs::create_dir_all(&outpath)?;
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(&p)?;
                }
            }
            let mut outfile = File::create(&outpath)?;
            io::copy(&mut file, &mut outfile)?;
        }
    }
    Ok(())
}
