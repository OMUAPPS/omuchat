import fs from 'fs/promises';
import path from 'path';

const paths = [
    'node_modules',
    'packages/omu/node_modules',
    'packages/omu/built',
    'packages/chat/node_modules',
    'packages/chat/built',
    'packages/i18n/node_modules',
    'packages/i18n/built',
    'packages/ui/node_modules',
    'packages/ui/dist',
    'packages/ui/.svelte-kit',
    'packages/dash/node_modules',
    'packages/dash/.svelte-kit',
    'packages/site/node_modules',
    'packages/site/.svelte-kit',
];

async function clean() {
    await Promise.all(
        paths.map(async (p) => {
            try {
                await fs.rm(path.join(p), { recursive: true });
            } catch (e) {
                console.error(`Error cleaning ${p}: ${e.message}`);
            }
        }),
    );
}

await clean();
