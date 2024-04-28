// https://github.com/astral-sh/rye/blob/ab8d5b433d5c4342c2bb125583c6bff4d29f5fbc/rye/src/bootstrap.rs#L510-L586 - MIT License
use std::io::Write;

use anyhow::{bail, Context, Error};

pub fn download_url(url: &str) -> Result<Vec<u8>, Error> {
    match download_url_ignore_404(url)? {
        Some(result) => Ok(result),
        None => bail!("Failed to download: 404 not found"),
    }
}

pub fn download_url_ignore_404(url: &str) -> Result<Option<Vec<u8>>, Error> {
    // for now we only allow HTTPS downloads.
    if !url.starts_with("https://") {
        bail!("Refusing insecure download");
    }

    let mut archive_buffer = Vec::new();
    let mut handle = curl::easy::Easy::new();
    handle.url(url)?;
    handle.progress(true)?;
    handle.follow_location(true)?;

    // on windows we want to disable revocation checks.  The reason is that MITM proxies
    // will otherwise not work.  This is a schannel specific behavior anyways.
    // for more information see https://github.com/curl/curl/issues/264
    #[cfg(windows)]
    {
        handle.ssl_options(curl::easy::SslOpt::new().no_revoke(true))?;
    }

    let write_archive = &mut archive_buffer;
    {
        let mut transfer = handle.transfer();
        transfer.write_function(move |data| {
            write_archive.write_all(data).unwrap();
            Ok(data.len())
        })?;
        transfer
            .perform()
            .with_context(|| format!("download of {} failed", &url))?;
    }
    let code = handle.response_code()?;
    if code == 404 {
        Ok(None)
    } else if !(200..300).contains(&code) {
        bail!("Failed to download: {}", code)
    } else {
        Ok(Some(archive_buffer))
    }
}
