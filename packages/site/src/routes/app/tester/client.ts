import { Chat } from '@omujs/chat';
import { App, Omu } from '@omujs/omu';
import { setClient } from '@omujs/ui';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const omu = new Omu(app);
export const chat = new Chat(omu);
setClient(omu);

if (BROWSER) {
    omu.start();
}
