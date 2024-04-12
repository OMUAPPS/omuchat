import type { Client } from '../../client/index.js';
import { Identifier } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

export const ASSET_EXTENSION_TYPE = new ExtensionType(
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

const ASSET_UPLOAD_ENDPOINT = EndpointType.createSerialized<Files, Identifier[]>(
    ASSET_EXTENSION_TYPE,
    {
        name: 'upload',
        requestSerializer: FILES_SERIALIZER,
        responseSerializer: Serializer.model(Identifier).toArray().pipe(Serializer.json()),
    },
);
const ASSET_DOWNLOAD_ENDPOINT = EndpointType.createSerialized<Identifier[], Files>(
    ASSET_EXTENSION_TYPE,
    {
        name: 'download',
        requestSerializer: Serializer.model(Identifier).toArray().pipe(Serializer.json()),
        responseSerializer: FILES_SERIALIZER,
    },
);

export class AssetExtension {
    constructor(private readonly client: Client) { }

    public async upload(...files: Files): Promise<Identifier[]> {
        const uploaded = await this.client.endpoints.call(ASSET_UPLOAD_ENDPOINT, files);
        return uploaded;
    }

    public async download(...identifiers: Identifier[]): Promise<Files> {
        const downloaded = await this.client.endpoints.call(ASSET_DOWNLOAD_ENDPOINT, identifiers);
        return downloaded;
    }

    public url(identifier: Identifier, {
        noCache,
    }: {
        noCache?: boolean;
    } = {}): string {
        const address = this.client.network.address;
        const protocol = address.secure ? 'https' : 'http';
        if (noCache) {
            return `${protocol}://${address.host}:${address.port}/asset?id=${encodeURIComponent(identifier.key())}&t=${Date.now()}`;
        }
        return `${protocol}://${address.host}:${address.port}/asset?id=${encodeURIComponent(identifier.key())}`;
    }

    public proxy(url: string): string {
        const address = this.client.network.address;
        const protocol = address.secure ? 'https' : 'http';
        return `${protocol}://${address.host}:${address.port}/proxy?url=${encodeURIComponent(url)}`;
    }
}
