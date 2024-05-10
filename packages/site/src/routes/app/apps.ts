import { App } from '@omuchatjs/omu';
import { client } from '../client.js';
import emoji from './emoji/app.js';
import notifier from './notifier/app.js';
import onecomme from './onecomme/app.js';
import playqueue from './playqueue/app.js';
import quiz from './quiz/app.js';
import reaction from './reaction/app.js';
import tester from './tester/app.js';
import translator from './translator/app.js';

export const apps = [] as App[];

export function loadApps(origin: string) {
    if (apps.length) return;
    apps.push(...[
        quiz,
        notifier,
        onecomme,
        playqueue,
        emoji,
        tester,
        reaction,
        translator,
    ].map((app) => app(origin)));
}

export const appTable = client.dashboard.apps;
client.whenReady(async () => {
    console.log(await appTable.fetchAll());
})
