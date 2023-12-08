import path from 'path';

import fse from 'fs-extra';


const srcDir = path.join('node_modules', '@tabler', 'icons-webfont');
const destDir = path.join('static', 'icons-webfont');
fse.copySync(srcDir, destDir, { overwrite: true })