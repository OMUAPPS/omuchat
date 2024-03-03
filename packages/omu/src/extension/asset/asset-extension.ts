import { Serializer } from '../../serializer.js';
import type { Client } from '../../client/index.js';
import { SerializeEndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';

export const AssetExtensionType = new ExtensionType('asset', (client: Client) => new AssetExtension(client));

type Files = Array<{ key: string; buffer: Uint8Array }>;

const FILES_SERIALIZER = new Serializer<Files, Uint8Array>((files) => {
    const writer = new ByteWriter();
    writer.writeInt(files.length);
    for (const file of files) {
        writer.writeString(file.key);
        writer.writeByteArray(file.buffer);
    }
    return writer.finish();
}, (data) => {
    const reader = new ByteReader(data);
    const count = reader.readInt();
    const files: Files = [];
    for (let i = 0; i < count; i++) {
        const key = reader.readString();
        const buffer = reader.readByteArray();
        files.push({ key, buffer });
    }
    reader.finish();
    return files;
});

export const AssetUploadEndpoint = SerializeEndpointType.ofExtension<Files, string[]>(AssetExtensionType, {
    name: 'upload',
    requestSerializer: FILES_SERIALIZER,
    responseSerializer: Serializer.json(),
});

export class AssetExtension {
    constructor(private readonly client: Client) {
    }

    async upload(...files: Files): Promise<string[]> {
        return this.client.endpoints.call(AssetUploadEndpoint, files);
    }
}
