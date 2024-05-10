import { App } from '../../app.js';
import { ByteReader, ByteWriter } from '../../bytebuffer.js';
import { PermissionType } from '../permission/permission.js';
import type { PackageInfo } from '../plugin/package-info.js';

export class PermissionRequestPacket {
    constructor(
        public readonly requestId: string,
        public readonly app: App,
        public readonly permissions: PermissionType[],
    ) { }

    public static serialize(packet: PermissionRequestPacket): Uint8Array {
        const writer = new ByteWriter();
        writer.writeString(packet.requestId);
        writer.writeString(JSON.stringify(packet.app.toJson()));
        writer.writeString(JSON.stringify(packet.permissions.map(permission => permission.toJson())));
        return writer.finish();
    }

    public static deserialize(data: Uint8Array): PermissionRequestPacket {
        const reader = new ByteReader(data);
        const requestId = reader.readString();
        const app = App.fromJson(JSON.parse(reader.readString()));
        const permissions = JSON.parse(reader.readString()).map(PermissionType.fromJson);
        return new PermissionRequestPacket(requestId, app, permissions);
    }
}

export class PluginRequestPacket {
    constructor(
        public readonly requestId: string,
        public readonly app: App,
        public readonly packages: PackageInfo[],
    ) { }

    public static serialize(packet: PluginRequestPacket): Uint8Array {
        const writer = new ByteWriter();
        writer.writeString(packet.requestId);
        writer.writeString(JSON.stringify(packet.app.toJson()));
        writer.writeString(JSON.stringify(packet.packages));
        return writer.finish();
    }

    public static deserialize(data: Uint8Array): PluginRequestPacket {
        const reader = new ByteReader(data);
        const requestId = reader.readString();
        const app = App.fromJson(JSON.parse(reader.readString()));
        const packages = JSON.parse(reader.readString());
        return new PluginRequestPacket(requestId, app, packages);
    }
}
