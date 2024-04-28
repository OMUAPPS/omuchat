use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::Error;
use serde::{Deserialize, Serialize};

use crate::sources::py::PythonVersion;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct VenvMarker {
    pub python: PythonVersion,
    pub venv_path: Option<PathBuf>,
}

impl VenvMarker {
    pub fn is_compatible(&self, py_ver: &PythonVersion) -> bool {
        self.python == *py_ver
    }
}

pub fn read_venv_marker(venv_path: &Path) -> Option<VenvMarker> {
    let marker_file = venv_path.join("rye-venv.json");
    let contents = fs::read(marker_file).ok()?;
    serde_json::from_slice(&contents).ok()
}

pub fn write_venv_marker(venv_path: &Path, py_ver: &PythonVersion) -> Result<(), Error> {
    let marker = venv_path.join("rye-venv.json");
    fs::write(
        &marker,
        serde_json::to_string_pretty(&VenvMarker {
            python: py_ver.clone(),
            venv_path: Some(venv_path.into()),
        })?,
    )
    .unwrap();

    Ok(())
}
