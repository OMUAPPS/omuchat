import fs from 'fs/promises';
import path from 'path';

const paths = [
    'packages/omu/built',
    'packages/chat/built',
    'packages/i18n/built',
    'packages/ui/dist',
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
