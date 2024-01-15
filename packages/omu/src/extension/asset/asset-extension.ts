import type { Client } from '../../client/index.js';
import { JsonEndpointType } from '../endpoint/endpoint.js';
import { defineExtensionType } from '../extension.js';

export const AssetExtensionType = defineExtensionType('asset', {
    create: (client: Client) => new AssetExtension(client),
});

interface PutEvent {
    [key: string]: string;
}

export const AssetUploadEndpoint = JsonEndpointType.ofExtension<PutEvent, string[]>(AssetExtensionType, {
    name: 'upload',
});

export class AssetExtension {
    constructor(private readonly client: Client) {
    }

    async upload(...files: Array<{ key: string; buffer: ArrayBuffer }>): Promise<string[]> {
        return this.client.endpoints.call(AssetUploadEndpoint, Object.fromEntries(await Promise.all(files.map(async (file) => [file.key, await this.encode(file.buffer)]))));
    }

    // TODO: バイト列を直接渡せるようにイベントをバイナリで送るようにする
    private async encode(array: ArrayBuffer): Promise<string> {
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(array).toString('base64');
        }
        // fast base64 encode method: https://gist.github.com/fonsp/a4a2d127f35e72deec14227c1bdf3d04#file-measure_performance-js
        const base64url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (): void => {
                if (typeof reader.result !== 'string') {
                    throw new Error('Invalid result');
                }
                return resolve(reader.result);
            };
            reader.readAsDataURL(new Blob([array]));
        });
        return base64url.split(',', 2)[1];
    }
}
