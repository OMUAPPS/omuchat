export type Unlisten = () => void;

export class EventEmitter<P extends Array<unknown>> {
    private readonly listeners: Array<(...args: P) => Promise<void> | void> = [];

    public listen(listener: (...args: P) => void): Unlisten {
        this.listeners.push(listener);
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }

    public async emit(...args: P): Promise<void> {
        for (const listener of [...this.listeners]) {
            await listener(...args);
        }
    }
}
