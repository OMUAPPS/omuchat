import type * as CSS from 'csstype';

function formatCSSKey(key: string) {
    return key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function style(style: CSS.Properties<string | number>) {
    return Object.entries(style)
        .map(([key, value]) => `${formatCSSKey(key)}: ${value};`)
        .join(' ');
}

export function applyOpacity(color: string, opacity: number) {
    return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent 0%)`;
}

export function classes(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}
