import { textDecoder, textEncoder } from '../const.js';

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

    write(data: Uint8Array): ByteWriter {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        this.allocate(data.length);
        new Uint8Array(this.buffer).set(data, this.offset);
        this.offset += data.length;
        return this;
    }

    writeBigInt(value: bigint): ByteWriter {
        this.allocate(8);
        this.dataArray.setBigInt64(this.offset, value);
        this.offset += 8;
        return this;
    }

    writeInt(value: number): ByteWriter {
        this.allocate(4);
        this.dataArray.setInt32(this.offset, value);
        this.offset += 4;
        return this;
    }

    writeShort(value: number): ByteWriter {
        this.allocate(2);
        this.dataArray.setInt16(this.offset, value);
        this.offset += 2;
        return this;
    }

    writeByte(value: number): ByteWriter {
        this.allocate(1);
        this.dataArray.setInt8(this.offset, value);
        this.offset += 1;
        return this;
    }

    writeByteArray(value: Uint8Array): ByteWriter {
        if (value.byteLength > 0x7fffffff) {
            throw new Error('Byte array too long');
        }
        this.writeInt(value.byteLength);
        this.write(value);
        return this;
    }

    writeString(value: string): ByteWriter {
        this.writeByteArray(textEncoder.encode(value));
        return this;
    }

    finish(): Uint8Array {
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

    read(size: number): Uint8Array {
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

    readBigInt(): bigint {
        const value = this.dataArray.getBigInt64(this.offset);
        this.offset += 8;
        return value;
    }

    readInt(): number {
        const value = this.dataArray.getInt32(this.offset);
        this.offset += 4;
        return value;
    }

    readShort(): number {
        const value = this.dataArray.getInt16(this.offset);
        this.offset += 2;
        return value;
    }

    readByte(): number {
        const value = this.dataArray.getInt8(this.offset);
        this.offset += 1;
        return value;
    }

    readByteArray(): Uint8Array {
        const length = this.readInt();
        return this.read(length);
    }

    readString(): string {
        return textDecoder.decode(this.readByteArray());
    }

    finish(): void {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        this.finished = true;
        if (this.offset !== this.dataArray.byteLength) {
            throw new Error('Buffer not fully read');
        }
    }
}
