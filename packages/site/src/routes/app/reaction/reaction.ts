import { makeRegistryWritable } from '$lib/helper.js';
import type { Omu } from '@omujs/omu';
import { RegistryType } from '@omujs/omu/extension/registry/index.js';
import type { Writable } from 'svelte/store';
import { IDENTIFIER } from './app.js';
import type { Chat } from '@omujs/chat';
import { Reaction } from '@omujs/chat/models/reaction.js';
import type { Signal } from '@omujs/omu/extension/signal/signal.js';

type ReactionReplaceRegistry = Record<string, string | null>;

const REACTION_REPLACE_REGISTRY_TYPE = RegistryType.createJson<ReactionReplaceRegistry>(
    IDENTIFIER,
    {
        name: 'reaction_replace',
        defaultValue: {
            '❤': null,
            '😄': null,
            '🎉': null,
            '😳': null,
            '💯': null,
        },
    },
);

export class ReactionApp {
    public readonly replaces: Writable<ReactionReplaceRegistry>;
    public readonly reactionSignal: Signal<Reaction>;

    constructor(
        private readonly omu: Omu,
        private readonly chat: Chat,
    ) {
        this.replaces = makeRegistryWritable(omu.registry.get(REACTION_REPLACE_REGISTRY_TYPE));
        this.reactionSignal = chat.reactionSignal;
    }

    public send(reaction: Reaction) {
        this.chat.reactionSignal.notify(reaction);
    }
}
