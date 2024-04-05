import { Client, events } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import { BROWSER } from 'esm-env';
import { identifier } from './app.js';
import { NotifyEntry } from './model.js';

const app = new App(identifier, {
    version: '1.0.0',
});
export const client = new Client({
    app,
});

export const notifyTable = client.tables.model(identifier, {
    name: 'notify',
    model: NotifyEntry,
});

client.on(events.MessageCreate, (message) => {
    console.log(message);
    if (/^!ping/.test(message.text)) {
        // play sound
    }
});

if (BROWSER) {
    client.start();
}
