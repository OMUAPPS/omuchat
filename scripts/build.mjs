import { execa, execaSync } from 'execa';

await Promise.all([
    execa('pnpm', ['--filter', 'ui', 'build'], {
        stderr: process.stderr,
        stdout: process.stdout,
    }),
    execa('pnpm', ['--filter', 'i18n', 'build'], {
        stderr: process.stderr,
        stdout: process.stdout,
    }),
    execa('pnpm', ['--filter', 'omu', 'build'], {
        stderr: process.stderr,
        stdout: process.stdout,
    }),
]);
execaSync('pnpm', ['--filter', 'chat', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});

if (process.argv.length > 2) {
    const target = process.argv[2];
    execaSync('pnpm', ['--filter', target, 'build'], {
        stderr: process.stderr,
        stdout: process.stdout,
    });
}
