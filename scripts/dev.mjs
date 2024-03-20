import { execa } from 'execa';
import.meta.url;

execa('pnpm', ['--filter', 'dash', 'dev'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'omu', 'dev'], { stderr: process.stderr, stdout: process.stdout });
execa('pnpm', ['--filter', 'chat', 'dev'], { stderr: process.stderr, stdout: process.stdout });
