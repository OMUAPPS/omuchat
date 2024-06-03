import { Spectrum } from './spectrum.js';

export const vowels: Map<string, Spectrum> = new Map();

vowels.set(
    'a',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'e',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'i',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'o',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'u',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'n',
    Spectrum.deserialize(
        `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`,
    ),
);
vowels.set(
    'breathe',
    Spectrum.deserialize(
        `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`,
    ),
);
