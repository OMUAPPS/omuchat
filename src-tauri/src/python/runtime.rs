use anyhow::{bail, Result};
use std::path::{Path, PathBuf};
use std::process::Stdio;
use tokio::io::AsyncReadExt;
use tokio::process::{Child, Command};
use tokio::sync::oneshot::Receiver;
use tracing::debug;
pub struct PythonRuntime(PathBuf);

impl PythonRuntime {
    pub fn new(path: PathBuf) -> Result<Self, String> {
        if !path.exists() {
            Err(format!("Python runtime does not exist: {:?}", path))?;
        }
        if !path.is_file() {
            Err(format!("Python runtime is not a file: {:?}", path))?;
        }
        Ok(Self(path))
    }

    pub fn set_env(&self, key: &str, value: &str) {
        std::env::set_var(key, value);
    }

    pub async fn execute(&self, arguments: Vec<String>, run_dir: &Path) -> Result<Child> {
        let mut command = Command::new(&self.0);
        command.current_dir(run_dir);
        command.args(arguments);

        // CREATE_NO_WINDOW https://learn.microsoft.com/ja-jp/windows/win32/procthread/process-creation-flags?redirectedfrom=MSDN#create_no_window
        #[cfg(target_os = "windows")]
        command.creation_flags(0x08000000);

        command.stderr(Stdio::piped()).stdout(Stdio::piped());

        let child = command.spawn()?;
        Ok(child)
    }

    pub async fn handle_io<D: Send + Sync>(
        &self,
        running_task: &mut Child,
        on_stdout: fn(&D, &[u8]) -> Result<()>,
        on_stderr: fn(&D, &[u8]) -> Result<()>,
        terminator: Receiver<()>,
        data: &D,
    ) -> Result<()> {
        let mut stdout = running_task.stdout.take().unwrap();
        let mut stderr = running_task.stderr.take().unwrap();

        let mut stdout_buf = vec![0; 1024];
        let mut stderr_buf = vec![0; 1024];

        tokio::pin!(terminator);

        loop {
            tokio::select! {
                read_len = stdout.read(&mut stdout_buf) => {
                    let _ = (on_stdout)(&data, &stdout_buf[..read_len?]);
                },
                read_len = stderr.read(&mut stderr_buf) => {
                    let _ = (on_stderr)(&data, &stderr_buf[..read_len?]);
                },
                _ = &mut terminator => {
                    running_task.kill().await?;
                    break;
                },
                exit_status = running_task.wait() => {
                    let code = exit_status?.code().unwrap_or(7900); // 7900 = unwrap failed error code

                    debug!("Process exited with code: {}", code);
                    if code != 0 {
                        bail!("Process exited with non-zero code: {}", code);
                    }
                    break;
                },
            }
        }
        Ok(())
    }
}
