import { textDecoder, textEncoder } from './const.js';

export class Flags {
    constructor(
        private value: number,
        private length: number,
    ) { }

    public has(position: number): boolean {
        return (this.value & (1 << position)) !== 0;
    }

    public get(position: number): boolean {
        return (this.value & (1 << position)) !== 0;
    }

    public ifSet<T>(position: number, callback: () => T): T | undefined {
        if (this.has(position)) {
            return callback();
        }
        return undefined;
    }

    public set(position: number, value: boolean): void {
        if (value) {
            this.value |= 1 << position;
        } else {
            this.value &= ~(1 << position);
        }
    }

    public write(writer: ByteWriter): void {
        const bits = new Uint8Array((this.length + 7) / 8);
        for (let i = 0; i < bits.length; i++) {
            bits[i] = (this.value >> (i * 8)) & 0xff;
        }
        writer.write(bits);
    }

    public static read(reader: ByteReader, length: number): Flags {
        let bits = 0;
        for (let i = 0; i < (length + 7) / 8; i++) {
            bits |= reader.readInt8() << (i * 8);
        }
        return new Flags(bits, length);
    }
}

export class ByteWriter {
    private dataArray: DataView;
    private buffer: ArrayBuffer;
    private offset = 0;
    private finished = false;

    constructor(init?: ArrayBuffer) {
        this.buffer = init ?? new ArrayBuffer(1024);
        this.dataArray = new DataView(this.buffer);
    }

    private allocate(length: number): void {
        if (this.offset + length > this.buffer.byteLength) {
            const newByteLength = Math.max(this.buffer.byteLength * 2, this.offset + length);
            const newBuffer = new ArrayBuffer(newByteLength);
            new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
            this.buffer = newBuffer;
            this.dataArray = new DataView(this.buffer);
        }
    }

    public write(data: Uint8Array): ByteWriter {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        this.allocate(data.length);
        new Uint8Array(this.buffer).set(data, this.offset);
        this.offset += data.length;
        return this;
    }

    public writeInt8(value: number): ByteWriter {
        this.allocate(1);
        this.dataArray.setInt8(this.offset, value);
        this.offset += 1;
        return this;
    }

    public writeUint32(value: number): ByteWriter {
        this.allocate(4);
        this.dataArray.setUint32(this.offset, value);
        this.offset += 4;
        return this;
    }

    public writeBigInt64(value: bigint): ByteWriter {
        this.allocate(8);
        this.dataArray.setBigInt64(this.offset, value);
        this.offset += 8;
        return this;
    }

    public writeInt32(value: number): ByteWriter {
        this.allocate(4);
        this.dataArray.setInt32(this.offset, value);
        this.offset += 4;
        return this;
    }

    public writeInt16(value: number): ByteWriter {
        this.allocate(2);
        this.dataArray.setInt16(this.offset, value);
        this.offset += 2;
        return this;
    }

    public writeFloat32(value: number): ByteWriter {
        this.allocate(4);
        this.dataArray.setFloat32(this.offset, value);
        this.offset += 4;
        return this;
    }

    public writeByteArray(value: Uint8Array): ByteWriter {
        if (value.byteLength > 0x7fffffff) {
            throw new Error('Byte array too long');
        }
        this.writeInt32(value.byteLength);
        this.write(value);
        return this;
    }

    public writeString(value: string): ByteWriter {
        this.writeByteArray(textEncoder.encode(value));
        return this;
    }

    public writeFlags(flags: Flags): ByteWriter {
        flags.write(this);
        return this;
    }

    public writeMap<V>(map: { [key: string]: V }, valueWriter: (writer: ByteWriter, value: V) => void): ByteWriter {
        this.writeInt32(Object.keys(map).length);
        for (const key in map) {
            this.writeString(key);
            valueWriter(this, map[key]);
        }
        return this;
    }

    public writeArray<T>(array: { [key: number]: T, length: number }, valueWriter: (writer: ByteWriter, value: T) => void): ByteWriter {
        this.writeInt32(array.length);
        for (let i = 0; i < array.length; i++) {
            valueWriter(this, array[i]);
        }
        return this;
    }

    public finish(): Uint8Array {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        this.finished = true;
        return new Uint8Array(this.buffer, 0, this.offset);
    }
}

export class ByteReader {
    private dataArray: DataView;
    private offset = 0;
    private finished = false;

    constructor(buffer: ArrayBuffer) {
        this.dataArray = new DataView(new Uint8Array(buffer).buffer);
    }

    public read(size: number): Uint8Array {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        if (size < 0) {
            throw new Error('Size must be positive');
        }
        if (this.offset + size > this.dataArray.byteLength) {
            throw new Error('Buffer not fully read');
        }
        const value = new Uint8Array(this.dataArray.buffer, this.offset, size);
        this.offset += size;
        return value;
    }

    public readInt8(): number {
        const value = this.dataArray.getInt8(this.offset);
        this.offset += 1;
        return value;
    }

    public readUint32(): number {
        const value = this.dataArray.getUint32(this.offset);
        this.offset += 4;
        return value;
    }

    public readBigInt64(): bigint {
        const value = this.dataArray.getBigInt64(this.offset);
        this.offset += 8;
        return value;
    }

    public readInt32(): number {
        const value = this.dataArray.getInt32(this.offset);
        this.offset += 4;
        return value;
    }

    public readInt16(): number {
        const value = this.dataArray.getInt16(this.offset);
        this.offset += 2;
        return value;
    }

    public readFloat32(): number {
        const value = this.dataArray.getFloat32(this.offset);
        this.offset += 4;
        return value;
    }

    public readByteArray(): Uint8Array {
        const length = this.readInt32();
        return this.read(length);
    }

    public readString(): string {
        return textDecoder.decode(this.readByteArray());
    }

    public readFlags(length: number): Flags {
        return Flags.read(this, length);
    }

    public readMap<V>(valueReader: (reader: ByteReader) => V): { [key: string]: V } {
        const length = this.readInt32();
        const map: { [key: string]: V } = {};
        for (let i = 0; i < length; i++) {
            const key = this.readString();
            map[key] = valueReader(this);
        }
        return map;
    }

    public readArray<T>(valueReader: (reader: ByteReader) => T): T[] {
        const length = this.readInt32();
        const array: T[] = [];
        for (let i = 0; i < length; i++) {
            array.push(valueReader(this));
        }
        return array;
    }

    public finish(): void {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        this.finished = true;
        if (this.offset !== this.dataArray.byteLength) {
            throw new Error('Buffer not fully read');
        }
    }
}
