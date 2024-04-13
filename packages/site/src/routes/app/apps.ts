import { App } from '@omuchatjs/omu';
import { TableType } from '@omuchatjs/omu/extension/table/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { client } from '../client.js';
import emoji from './emoji/app.js';
import notifier from './notifier/app.js';
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
        playqueue,
        emoji,
        tester,
        reaction,
        translator,
    ].map((app) => app(origin)));
}

const DASHBOARD = Identifier.fromKey('cc.omuchat:dashboard');
export const appTable = client.tables.get(
    TableType.model(DASHBOARD, {
        name: 'apps',
        model: App,
    }),
);
