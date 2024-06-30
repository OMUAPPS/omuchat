import { Identifier, Omu } from '@omujs/omu';
import { EndpointType } from '@omujs/omu/extension/endpoint/endpoint.js';
import { RegistryType } from '@omujs/omu/extension/registry/registry.js';
import { APP_ID } from './app.js';
import type { Writable } from 'svelte/store';
import { makeRegistryWritable } from '$lib/helper.js';

const PLUGIN_ID = Identifier.fromKey('com.omuapps:marshmallow/plugin');
export type User = {
    name: string;
    screen_name: string;
    image: string;
};

export type Message = {
    message_id: string;
    liked: boolean;
    content: string;
    like_token: string;
};

const REFRESH_USERS_ENDPOINT_TYPE = EndpointType.createJson<null, Record<string, User>>(PLUGIN_ID, {
    name: 'refresh_users',
});
const GET_MESSAGES_ENDPOINT_TYPE = EndpointType.createJson<string, Message[]>(PLUGIN_ID, {
    name: 'get_messages',
});

export type MarshmallowConfig = {
    user: string | null;
};

const MARSHMALLOW_CONFIG_REGISTRY_TYPE = RegistryType.createJson<MarshmallowConfig>(APP_ID, {
    name: 'marshmallow_config',
    defaultValue: {
        user: null,
    },
});

export class MarshmallowApp {
    public readonly config: Writable<MarshmallowConfig>;

    constructor(private readonly omu: Omu) {
        this.config = makeRegistryWritable(omu.registry.get(MARSHMALLOW_CONFIG_REGISTRY_TYPE));
    }

    async refreshUsers(): Promise<Record<string, User>> {
        return this.omu.endpoints.call(REFRESH_USERS_ENDPOINT_TYPE, null);
    }

    async getMessages(user: string): Promise<Message[]> {
        return this.omu.endpoints.call(GET_MESSAGES_ENDPOINT_TYPE, user);
    }
}
