import { textDecoder, textEncoder } from './const.js';
`
class ByteWriter:
    def __init__(self, init: bytes | None = None) -> None:
        self.stream = io.BytesIO(init or b"")

    def write(self, data: bytes) -> ByteWriter:
        self.stream.write(data)
        return self

    def write_int(self, value: int) -> ByteWriter:
        self.write(value.to_bytes(4, "big"))
        return self

    def write_short(self, value: int) -> ByteWriter:
        self.write(value.to_bytes(2, "big"))
        return self

    def write_byte(self, value: int) -> ByteWriter:
        self.write(value.to_bytes(1, "big"))
        return self

    def write_byte_array(self, value: bytes) -> ByteWriter:
        self.write_short(len(value))
        self.write(value)
        return self

    def write_string(self, value: str) -> ByteWriter:
        self.write_byte_array(value.encode("utf-8"))
        return self

    def build(self) -> bytes:
        return self.stream.getvalue()


class ByteReader:
    def __init__(self, buffer: bytes) -> None:
        self.stream = io.BytesIO(buffer)

    def read(self, size: int | None = None) -> bytes:
        return self.stream.read(size)

    def read_int(self) -> int:
        return int.from_bytes(self.read(4), "big")

    def read_short(self) -> int:
        return int.from_bytes(self.read(2), "big")

    def read_byte(self) -> int:
        return int.from_bytes(self.read(1), "big")

    def read_byte_array(self) -> bytes:
        length = self.read_short()
        return self.read(length)

    def read_string(self) -> str:
        return self.read_byte_array().decode("utf-8")
`;
export class ByteWriter {
    private dataArray: DataView;
    private buffer: ArrayBuffer;
    private offset = 0;

    constructor(init?: ArrayBuffer) {
        this.buffer = init ?? new ArrayBuffer(1024);
        this.dataArray = new DataView(this.buffer);
    }

    write(data: Uint8Array): ByteWriter {
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
        this.writeShort(value.byteLength);
        this.write(value);
        return this;
    }

    writeString(value: string): ByteWriter {
        this.writeByteArray(textEncoder.encode(value));
        return this;
    }

    build(): ArrayBuffer {
        return this.buffer.slice(0, this.offset);
    }
}

export class ByteReader {
    private dataArray: DataView;
    private offset = 0;

    constructor(buffer: ArrayBuffer) {
        this.dataArray = new DataView(buffer);
    }

    read(size?: number): Uint8Array {
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
}
