import { App, Client } from '@omuchatjs/chat';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { Locale } from '@omuchatjs/omu/localization/index.js';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';

const identifier = new Identifier('cc.omuchat', 'page');
const app = new App(identifier, {
    version: '1.0.0',
});
export const client = setClient(new Client({ app }));

if (BROWSER) {
    client.i18n.locales = window.navigator.languages as Locale[];
    client.start();
}
