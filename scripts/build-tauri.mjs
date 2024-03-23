import { execa } from 'execa';

execa('pnpm', ['--filter', 'dash', 'build'], {
    stderr: process.stderr,
    stdout: process.stdout,
});
