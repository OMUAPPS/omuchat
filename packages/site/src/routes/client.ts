import { browser } from '$app/environment';
import { App, Client } from '@omuchatjs/chat';

const app = new App({
    group: 'cc.omuchat',
    name: 'page',
    version: '1.0.0',
});
export const client = new Client({ app });

if (browser) {
    client.start();
}
