import { Chat } from '@omujs/chat';
import { Omu } from '@omujs/omu';
import { BROWSER } from 'esm-env';
import { APP, IDENTIFIER } from './app.js';
import { NotifyEntry } from './model.js';

export const omu = new Omu(APP);
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
