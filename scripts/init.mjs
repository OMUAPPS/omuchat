import { execa } from 'execa';
import.meta.url;

execa('pnpm', ['--filter', 'omu', 'ts'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'chat', 'ts'], { stderr: process.stderr, stdout: process.stdout });
