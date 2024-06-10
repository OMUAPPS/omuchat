export class Timer {
    private lastTime: number;

    constructor() {
        this.lastTime = Date.now();
    }

    public getElapsedTime(): number {
        return Date.now() - this.lastTime;
    }

    public reset(): void {
        this.lastTime = Date.now();
    }
}