import type { LocalizedText } from "@omuchatjs/omu/localization/localization.js";

export type Tag = {
    name: LocalizedText;
    description: LocalizedText;
    icon: string;
}

export const TAG_REGISTRY = {
    youtube: {
        name: {
            en: 'Youtube',
            ja: 'Youtube',
        },
        description: {
            en: 'Apps related to Youtube.',
            ja: 'Youtubeに関連するアプリ。',
        },
        icon: 'ti ti-brand-youtube',
    },
    asset: {
        name: {
            en: 'Assets',
            ja: 'アセット',
        },
        description: {
            en: 'Apps that provide assets.',
            ja: 'アセットを提供するアプリ。',
        },
        icon: 'ti ti-library-photo',
    },
    game: {
        name: {
            en: 'Game',
            ja: 'ゲーム',
        },
        description: {
            en: 'Game apps.',
            ja: 'ゲームアプリ。',
        },
        icon: 'ti ti-device-gamepad',
    },
    tool: {
        name: {
            en: 'Tool',
            ja: 'ツール',
        },
        description: {
            en: 'Tool apps.',
            ja: 'ツールアプリ。',
        },
        icon: 'ti ti-tools',
    },
} as const satisfies Record<string, Tag>;
export const REGISTRIES = { ...TAG_REGISTRY } as Record<string, Tag>;

export type TagKey = keyof typeof TAG_REGISTRY;
