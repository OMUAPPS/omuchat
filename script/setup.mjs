import fs from 'fs/promises';
import path from 'path';

import license from 'license-checker';


async function generateLicense() {
    const licenses = await new Promise((resolve, reject) => {
        license.init(
            {
                start: './',
                json: true
            },
            (err, licenses) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(licenses);
                }
            }
        );
    });
    const destDir = path.join('src', 'lib', 'license');
    const destFile = path.join(destDir, 'licenses.json');
    await fs.writeFile(
        destFile,
        JSON.stringify([
            ...Object.entries(licenses).map(([key, license]) => ({
                name: license.name || key,
                repository: license.repository,
                url: license.url,
                license: license.licenses,
                licenseText: license.licenseFile && fs.readFile(license.licenseFile, 'utf8')
            }))
        ])
    );
}

async function setup() {
    await generateLicense();
}

await setup();