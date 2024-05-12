import { createRegistryStore } from '$lib/helper.js';
import { models } from '@omuchatjs/chat';
import { Provider } from '@omuchatjs/chat/models/provider.js';
import { RegistryType } from '@omuchatjs/omu/extension/registry/registry.js';
import { TableType } from '@omuchatjs/omu/extension/table/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { Keyable } from '@omuchatjs/omu/interface.js';
import type { Model } from '@omuchatjs/omu/model.js';
import { writable } from 'svelte/store';
import { IDENTIFIER } from './app.js';
import { client } from './client.js';

const PLUGIN_IDENTIFIER = IDENTIFIER.join('plugin');

export type EmojiConfig = {
    active: boolean;
};

export const config = createRegistryStore(
    client,
    RegistryType.createJson<EmojiConfig>(PLUGIN_IDENTIFIER, {
        name: 'config',
        defaultValue: {
            active: true,
        },
    }),
);

export type TextPattern = {
    type: 'text';
    text: string;
};

export type ImagePattern = {
    type: 'image';
    id: string;
};

export type RegexPattern = {
    type: 'regex';
    regex: string;
};

export type Pattern = TextPattern | ImagePattern | RegexPattern;

export interface EmojiData {
    readonly id: string;
    asset: string;
    patterns: Pattern[];
}

export class Emoji implements Model<EmojiData>, Keyable {
    readonly id: string;
    asset: Identifier;
    patterns: Pattern[];

    constructor(options: { id: string; asset: Identifier; patterns: Pattern[] }) {
        this.id = options.id;
        this.asset = options.asset;
        this.patterns = options.patterns;
    }

    public getPatternText() {
        return this.patterns
            .map((pattern) => {
                if (pattern.type === 'text') {
                    return pattern.text;
                }
                if (pattern.type === 'image') {
                    return `:${pattern.id}:`;
                }
                if (pattern.type === 'regex') {
                    return pattern.regex;
                }
                return '';
            })
            .join(' ');
    }

    key() {
        return this.id;
    }

    static fromJson(data: EmojiData) {
        return new Emoji({
            id: data.id,
            asset: Identifier.fromKey(data.asset),
            patterns: data.patterns,
        });
    }

    toJson() {
        return {
            id: this.id,
            asset: this.asset.key(),
            patterns: this.patterns,
        };
    }
}

export const EMOJI_TABLE = TableType.createModel(PLUGIN_IDENTIFIER, {
    name: 'emoji',
    model: Emoji,
});

export const emojis = client.tables.get(EMOJI_TABLE);
export const selectedEmoji = writable<Emoji | null>(null);

export function deleteEmoji(emoji: Emoji) {
    emojis.remove(emoji);
    selectedEmoji.update((value) => {
        if (value?.id === emoji.id) {
            return null;
        }
        return value;
    });
}

export function saveEmoji(emoji: Emoji) {
    emojis.update(emoji);
    selectedEmoji.set(null);
}

export function editEmoji(emoji: Emoji) {
    selectedEmoji.set(emoji);
}

export const EMOJI_TEST_PROVIDER = new Provider({
    id: client.app.id,
    name: 'Emoji Test',
    description: 'Send emoji preview',
    regex: '',
    repository_url: 'https://github.com/omuchat/omuchat',
    url: 'https://example.com',
    version: '0.0.1',
});

export function testEmoji(emoji: Emoji) {
    const room = new models.Room({
        id: EMOJI_TEST_PROVIDER.id.join('test'),
        providerId: EMOJI_TEST_PROVIDER.id,
        connected: false,
        status: 'offline',
        createdAt: new Date(),
    });
    client.chat.rooms.update(room);
    client.chat.messages.add(
        new models.Message({
            id: EMOJI_TEST_PROVIDER.id.join('test', 'message', new Date().getTime().toString()),
            roomId: room.id,
            content: new models.content.System([
                models.content.Image.of({
                    url: client.assets.url(emoji.asset),
                    id: emoji.id,
                    name: emoji.id,
                }),
                models.content.Text.of(emoji.id),
            ]),
            createdAt: new Date(),
        }),
    );
}
