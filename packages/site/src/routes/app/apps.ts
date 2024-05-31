import { App } from '@omujs/omu';
import { omu } from '../client.js';
import { APP as emoji } from './emoji/app.js';
import { APP as notifier } from './notifier/app.js';
import { APP as onecomme } from './onecomme/app.js';
import { APP as playqueue } from './playqueue/app.js';
import { APP as reaction } from './reaction/app.js';
import { APP as tester } from './tester/app.js';
import { APP as translator } from './translator/app.js';
import { APP as caption } from './caption/app.js';
import { APP as archive } from './archive/app.js';

export const apps = [
    emoji,
    notifier,
    onecomme,
    playqueue,
    reaction,
    tester,
    translator,
    caption,
    archive,
] satisfies App[];

export const appTable = omu.dashboard.apps;
omu.onReady(async () => {
    console.log(await appTable.fetchAll());
});
