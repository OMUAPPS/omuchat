export type Unlisten = () => void;

export class EventEmitter<T extends (...args: any[]) => any> {
    private readonly listeners: Array<T> = [];

    public listen(listener: T): Unlisten {
        this.listeners.push(listener);
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }

    public async emit(...args: Parameters<T>): Promise<void> {
        for (const listener of [...this.listeners]) {
            await listener(...args);
        }
    }
}
