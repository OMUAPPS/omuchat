const path = require('path');

const fse = require('fs-extra');


const srcDir = path.join(__dirname, '..', 'node_modules', '@tabler', 'icons-webfont');
const destDir = path.join(__dirname, '..', 'static', 'icons-webfont');
fse.copySync(srcDir, destDir, { overwrite: true })