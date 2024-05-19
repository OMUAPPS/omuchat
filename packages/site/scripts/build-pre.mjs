import fs from 'fs/promises';
import path from 'path';

async function generateVersion() {
    const rootWorkspace = path.resolve(process.cwd(), '..', '..');
    const lerna = JSON.parse(await fs.readFile(path.join(rootWorkspace, 'lerna.json'), 'utf8'));
    const versionFile = path.join('src', 'lib', 'version.json');
    await fs.writeFile(versionFile, JSON.stringify({ version: lerna.version }));
}

await generateVersion();
