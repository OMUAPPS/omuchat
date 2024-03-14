import { Client } from "../index.js"
import { Packet, PacketType } from "./packet/packet.js"
import { Connection, PacketMapper } from "./connection.js"
import { EventEmitter } from "../event-emitter.js";
import { ConnectPacket, PACKET_TYPES } from "./packet/packet-types.js";
import { TokenProvider } from "../client/token.js";
import { Address } from "./address.js";

type PacketListeners<T> = {
    readonly type: PacketType<T>,
    readonly listeners: EventEmitter<(packet: T) => void>,
};


export type NetworkStatus = "connecting" | "connected" | "disconnected";

export class Network {
    public connected: boolean = false;
    public readonly listeners = {
        connected: new EventEmitter<() => void>,
        disconnected: new EventEmitter<() => void>,
        packet: new EventEmitter<(packet: Packet) => void>,
        status: new EventEmitter<(status: NetworkStatus) => void>,
    };
    private readonly tasks: Array<() => Promise<void> | void> = [];
    private readonly packetMapper = new PacketMapper();
    private readonly packetHandlers = new Map<string, PacketListeners<unknown>>();

    constructor(
        private readonly client: Client,
        private readonly address: Address,
        private readonly tokenProcider: TokenProvider,
        private connection: Connection,
    ) {
        this.packetMapper.register(
            PACKET_TYPES.CONNECT,
            PACKET_TYPES.DISCONNECT,
            PACKET_TYPES.TOKEN,
            PACKET_TYPES.READY,
        );
    }

    public setConnection(connection: Connection): void {
        if (this.connected) {
            throw new Error("Cannot change connection while connected");
        }
        this.connection = connection;
    }

    public registerPacket(...packetTypes: PacketType<unknown>[]): void {
        this.packetMapper.register(...packetTypes);
        for (const type of packetTypes) {
            this.packetHandlers.set(type.identifier.key(), {
                type,
                listeners: new EventEmitter(),
            });
        }
    }

    public addPacketHandler<T>(type: PacketType<T>, handler: (packet: T) => void): void {
        const listeners = this.packetHandlers.get(type.identifier.key()) as PacketListeners<unknown>;
        if (!listeners) {
            throw new Error(`Packet type ${type.identifier.key()} not registered`);
        }
        listeners.listeners.subscribe(handler as (packet: unknown) => void);
    }

    public async connect(recconect: boolean = false): Promise<void> {
        if (this.connected) {
            throw new Error("Already connected");
        }

        this.disconnect();
        await this.connection.connect();
        this.connected = true;
        this.send({
            type: PACKET_TYPES.CONNECT,
            data: new ConnectPacket({
                app: this.client.app,
                token: await this.tokenProcider.get(this.address, this.client.app),
            }),
        });
        this.listeners.status.emit("connected");
        this.listeners.connected.emit();
        this.dispatchTasks();

        await this.listen();

        if (recconect) {
            await this.connect(recconect);
        }
    }

    public disconnect(): void {
        if (!this.connected) {
            return;
        }
        this.connected = false;
        this.connection.close();
        this.listeners.status.emit("disconnected");
        this.listeners.disconnected.emit();
    }

    public send(packet: Packet): void {
        this.connection.send(packet, this.packetMapper);
    }

    private async listen(): Promise<void> {
        try {
            while (!this.connection.closed) {
                const packet = await this.connection.receive(this.packetMapper);
                this.dispatchPacket(packet);
            }
        } finally {
            this.disconnect();
        }
    }

    private async dispatchPacket(packet: Packet): Promise<void> {
        await this.listeners.packet.emit(packet);
        const packetHandlers = this.packetHandlers.get(packet.type.identifier.key());
        if (!packetHandlers) {
            return;
        }
        await packetHandlers.listeners.emit(packet.data);
    }

    public addTask(task: () => Promise<void> | void): void {
        this.tasks.push(task);
    }

    public removeTask(task: () => Promise<void> | void): void {
        this.tasks.splice(this.tasks.indexOf(task), 1);
    }

    private async dispatchTasks(): Promise<void> {
        for (const task of this.tasks) {
            await task();
        }
    }
}
