export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function clamp(x: number, min: number, max: number): number {
    return Math.max(min, Math.min(x, max));
}
