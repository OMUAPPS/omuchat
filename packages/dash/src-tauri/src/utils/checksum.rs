use anyhow::{bail, Error};
use sha2::{Digest, Sha256};

pub fn check_checksum(content: &[u8], checksum: &str) -> Result<(), Error> {
    let mut hasher = Sha256::new();
    hasher.update(content);
    let digest = hasher.finalize();
    let digest = hex::encode(digest);
    if !digest.eq_ignore_ascii_case(checksum) {
        bail!("hash mismatch: expected {} got {}", checksum, digest);
    }
    Ok(())
}
