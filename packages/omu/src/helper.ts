import { textDecoder, textEncoder } from './const.js';

export class ByteWriter {
    private dataArray: DataView;
    private buffer: ArrayBuffer;
    private offset = 0;
    private finished = false;

    constructor(init?: ArrayBuffer) {
        this.buffer = init ?? new ArrayBuffer(1024);
        this.dataArray = new DataView(this.buffer);
    }

    write(data: Uint8Array): ByteWriter {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        if (this.offset + data.length > this.buffer.byteLength) {
            const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
            new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
            this.buffer = newBuffer;
            this.dataArray = new DataView(this.buffer);
        }
        new Uint8Array(this.buffer, this.offset, data.length).set(data);
        this.offset += data.length;
        return this;
    }

    writeInt(value: number): ByteWriter {
        this.dataArray.setInt32(this.offset, value);
        this.offset += 4;
        return this;
    }

    writeShort(value: number): ByteWriter {
        this.dataArray.setInt16(this.offset, value);
        this.offset += 2;
        return this;
    }

    writeByte(value: number): ByteWriter {
        this.dataArray.setInt8(this.offset, value);
        this.offset += 1;
        return this;
    }

    writeByteArray(value: Uint8Array): ByteWriter {
        if (value.byteLength > 0xffff) {
            throw new Error('Byte array too long');
        }
        this.writeShort(value.byteLength);
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

    read(size?: number): Uint8Array {
        if (this.finished) {
            throw new Error('Buffer already finished');
        }
        const sizeToRead = size ?? this.dataArray.byteLength - this.offset;
        const value = new Uint8Array(this.dataArray.buffer, this.offset, sizeToRead);
        this.offset += sizeToRead;
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
        const length = this.readShort();
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
