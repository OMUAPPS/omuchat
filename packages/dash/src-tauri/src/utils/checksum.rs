use anyhow::{bail, Error};
use sha2::{Digest, Sha256};

// https://github.com/astral-sh/rye/blob/ab8d5b433d5c4342c2bb125583c6bff4d29f5fbc/rye/src/utils/mod.rs#L422-L431 - MIT License
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
