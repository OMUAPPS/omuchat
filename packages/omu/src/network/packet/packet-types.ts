import { Model } from "../../model.js";
import { Identifier } from "../../identifier.js";
import { PacketType } from "./packet.js";
import { App, AppJson } from "../../app.js";
import { Serializer } from "../../serializer.js";

const IDENTIFIER = new Identifier('omu', 'packet');

type ConnectPacketJson = {
    app: AppJson,
    token?: string,
};
export class ConnectPacket implements Model<ConnectPacketJson> {
    public readonly app: App;
    public readonly token?: string;
    constructor(options: {
        app: App,
        token?: string,
    }) {
        this.app = options.app;
        this.token = options.token;
    }

    static fromJson(data: ConnectPacketJson): ConnectPacket {
        return new ConnectPacket({
            app: App.fromJson(data.app),
            token: data.token,
        });
    }

    toJson(): ConnectPacketJson {
        return {
            app: this.app.toJson(),
            token: this.token,
        };
    }
}

type DisconnectPacketJson = {
    reason: string,
};

export class DisconnectPacket implements Model<DisconnectPacketJson> {
    public readonly reason: string;
    constructor(options: {
        reason: string,
    }) {
        this.reason = options.reason;
    }

    static fromJson(data: DisconnectPacketJson): DisconnectPacket {
        return new DisconnectPacket({
            reason: data.reason,
        });
    }

    toJson(): DisconnectPacketJson {
        return {
            reason: this.reason,
        };
    }
}

export const PACKET_TYPES = {
    CONNECT: PacketType.createJson<ConnectPacket>(IDENTIFIER, {
        name: 'connect',
        serializer: Serializer.model(ConnectPacket),
    }),
    DISCONNECT: PacketType.createJson<DisconnectPacket>(IDENTIFIER, {
        name: 'disconnect',
        serializer: Serializer.model(DisconnectPacket),
    }),
    TOKEN: PacketType.createJson<string>(IDENTIFIER, {
        name: 'token',
    }),
    READY: PacketType.createJson<undefined>(IDENTIFIER, {
        name: 'ready',
    }),
};
