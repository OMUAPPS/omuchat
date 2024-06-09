use std::path::PathBuf;

use crate::sources::py::PythonVersionRequest;

#[derive(Debug, Clone)]
pub struct InstallOptions {
    pub python_version: PythonVersionRequest,
    pub python_path: PathBuf,
    pub uv_path: PathBuf,
    pub workdir: PathBuf,
}
