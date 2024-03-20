export function callbackUnion(...callbacks: (() => void)[]): void {
    for (const callback of callbacks) {
        callback();
    }
}
