import path from 'path';

import fse from 'fs-extra';
import license from 'license-checker';

function getLicenses() {
    return new Promise((resolve, reject) => {
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
}

(async () => {
    const licenses = await getLicenses();
    // copy to src\lib\license\licenses.json
    const destDir = path.join('src', 'lib', 'license');
    const destFile = path.join(destDir, 'licenses.json');
    fse.outputFileSync(
        destFile,
        JSON.stringify([
            ...Object.entries(licenses).map(([key, license]) => ({
                name: license.name || key,
                repository: license.repository,
                url: license.url,
                license: license.licenses,
                licenseText: license.licenseFile && fse.readFileSync(license.licenseFile, 'utf8')
            }))
        ])
    );
})();
