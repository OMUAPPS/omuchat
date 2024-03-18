import type { Client } from '../../client/index.js';
import { Identifier } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

export const AssetExtensionType = new ExtensionType(
    'asset',
    (client: Client) => new AssetExtension(client),
);

type Files = Array<{ identifier: Identifier; buffer: Uint8Array }>;

const FILES_SERIALIZER = new Serializer<Files, Uint8Array>(
    (files) => {
        const writer = new ByteWriter();
        writer.writeInt(files.length);
        for (const file of files) {
            writer.writeString(file.identifier.key());
            writer.writeByteArray(file.buffer);
        }
        return writer.finish();
    },
    (data) => {
        const reader = new ByteReader(data);
        const count = reader.readInt();
        const files: Files = [];
        for (let i = 0; i < count; i++) {
            const identifier = Identifier.fromKey(reader.readString());
            const buffer = reader.readByteArray();
            files.push({ identifier, buffer });
        }
        reader.finish();
        return files;
    },
);

const IDENTIFIER_SERIALIZER = new Serializer<Identifier, string>(
    (identifier) => identifier.key(),
    (key) => Identifier.fromKey(key),
).array().pipe(Serializer.json());

export const AssetUploadEndpoint = EndpointType.createSerialized<Files, Identifier[]>(
    AssetExtensionType,
    {
        name: 'upload',
        requestSerializer: FILES_SERIALIZER,
        responseSerializer: IDENTIFIER_SERIALIZER,
    },
);
export const AssetDownloadEndpoint = EndpointType.createSerialized<Identifier[], Files>(
    AssetExtensionType,
    {
        name: 'download',
        requestSerializer: IDENTIFIER_SERIALIZER,
        responseSerializer: FILES_SERIALIZER,
    },
);

export class AssetExtension {
    constructor(private readonly client: Client) { }

    async upload(...files: Files): Promise<Identifier[]> {
        return this.client.endpoints.call(AssetUploadEndpoint, files);
    }

    async download(...identifiers: Identifier[]): Promise<Files> {
        return this.client.endpoints.call(AssetDownloadEndpoint, identifiers);
    }

    url(identifier: Identifier): string {
        const address = this.client.network.address;
        const protocol = address.secure ? 'https' : 'http';
        return `${protocol}://${address.host}:${address.port}/asset?id=${encodeURIComponent(identifier.key())}`;
    }
}
