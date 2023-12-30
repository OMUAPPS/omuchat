interface License {
    name: string;
    license: string;
    url?: string;
    repository?: string;
    licenseText?: string;
}

import licenses from './licenses.json';
import * as TablerIcons from './tabler-icons';

export const LICENSES: License[] = [
    TablerIcons,
    ...licenses,
];