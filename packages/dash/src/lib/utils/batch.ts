export function batchCall(...callbacks: (() => void)[]): void {
    for (const callback of callbacks) {
        callback();
    }
}
