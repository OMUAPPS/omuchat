export class EventEmitter<T extends (...args: any[]) => any> {
    private readonly listeners: Array<T> = [];

    subscribe(listener: T): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }

    unsubscribe(listener: T): void {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    async emit(...args: Parameters<T>): Promise<void> {
        for (const listener of this.listeners) {
            await listener(...args);
        }
    }
}
