import { execa, execaSync } from 'execa';

execaSync('pnpm', ['--filter', 'i18n', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

execaSync('pnpm', ['--filter', 'omu', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

execaSync('pnpm', ['--filter', 'chat', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

execaSync('pnpm', ['--filter', 'ui', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

execa('pnpm', ['--filter', 'dash', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});
