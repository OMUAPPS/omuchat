import { App, Omu } from '@omujs/omu';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';
import { NotifyEntry } from './model.js';
import { Chat } from '@omujs/chat';

const app = new App(IDENTIFIER, {
    version: '1.0.0',
});
export const omu = new Omu(app);
const chat = new Chat(omu);
export const notifyTable = omu.tables.model(IDENTIFIER, {
    name: 'notify',
    model: NotifyEntry,
});

chat.messages.event.add.listen((messages) => {
    messages.forEach((message) => {
        console.log(message);
        if (/^!ping/.test(message.text)) {
            // play sound
        }
    });
});

if (BROWSER) {
    omu.start();
}
