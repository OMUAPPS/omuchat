import fs from 'fs/promises';
import path from 'path';
import license from 'license-checker';

async function generateLicense() {
    const licenses = await new Promise((resolve, reject) => {
        license.init(
            {
                start: './',
                json: true,
            },
            (err, licenses) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(licenses);
                }
            },
        );
    });
    const destDir = path.join('src', 'lib', 'license');
    const destFile = path.join(destDir, 'licenses.json');
    await fs.writeFile(
        destFile,
        JSON.stringify([
            ...(await Promise.all(
                Object.entries(licenses).map(async ([key, license]) => ({
                    name: license.name || key,
                    repository: license.repository,
                    url: license.url,
                    license: license.licenses,
                    licenseText:
                        license.licenseFile && (await fs.readFile(license.licenseFile, 'utf8')),
                })),
            )),
        ]),
    );
}

async function generateVersion() {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const destFile = path.join('src-tauri', 'tauri.conf.json');
    const tauriConfig = JSON.parse(await fs.readFile(destFile, 'utf8'));
    tauriConfig.package.version = pkg.version;
    await fs.writeFile(destFile, JSON.stringify(tauriConfig, null, 4));
}

async function main() {
    const tasks = [generateLicense(), generateVersion()];
    await Promise.all(tasks);
}

await main();
