export function batchCall(...callbacks: (() => void)[]): () => void {
    return () => {
        for (const callback of callbacks) {
            callback();
        }
    };
}
