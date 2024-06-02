import { inflate, deflate } from 'pako';
import { Buffer } from 'buffer';

export class Spectrum {
    constructor(public readonly buffer: Float32Array) {}

    public static deserialize(data: string): Spectrum {
        const buffer = new Uint8Array(Buffer.from(data, 'base64'));
        const array = new Float32Array(inflate(buffer).buffer);
        return new Spectrum(array);
    }

    public serialize(): string {
        const buffer = deflate(Buffer.from(this.buffer.buffer));
        return Buffer.from(buffer).toString('base64');
    }

    public normalize(): Spectrum {
        const magnitude = Math.sqrt(this.buffer.reduce((acc, x) => acc + x * x, 0));
        return new Spectrum(this.buffer.map((x) => x / magnitude));
    }

    public dot(other: Spectrum): number {
        return this.buffer.reduce((acc, x, i) => acc + x * other.buffer[i], 0);
    }
}
