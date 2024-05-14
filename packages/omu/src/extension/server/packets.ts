import { ByteReader, ByteWriter } from '../../bytebuffer.js';

export class ConsolePacket {
    constructor(public lines: string[]) {}

    static serialize(item: ConsolePacket): Uint8Array {
        const writer = new ByteWriter();
        writer.writeInt(item.lines.length);
        for (const line of item.lines) {
            writer.writeString(line);
        }
        return writer.finish();
    }

    static deserialize(item: Buffer): ConsolePacket {
        const reader = new ByteReader(item);
        const lineCount = reader.readInt();
        const lines = [] as string[];
        for (let i = 0; i < lineCount; i++) {
            lines.push(reader.readString());
        }
        return new ConsolePacket(lines);
    }
}
