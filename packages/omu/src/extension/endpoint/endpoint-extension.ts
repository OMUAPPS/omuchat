import type { Client } from '../../client/index.js';
import { textDecoder, textEncoder } from '../../const.js';
import { JsonEventType, SerializeEventType } from '../../event/index.js';
import { Serializer } from '../../interface/serializable.js';
import { defineExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { ModelTableType } from '../table/index.js';

import { type EndpointType } from './endpoint.js';
import { EndpointInfo } from './model/index.js';

type CallFuture = {
    resolve: (data: any) => void;
    reject: (error: Error) => void;
}

export class EndpointExtension {
    private readonly endpointMap: Map<string, EndpointType>;
    public readonly endpoints: Table<EndpointInfo>;
    private readonly promiseMap: Map<number, CallFuture>;
    private callId: number;

    constructor(private readonly client: Client) {
        this.endpointMap = new Map();
        this.promiseMap = new Map();
        this.endpoints = this.client.tables.get(EndpointsTableType);
        this.callId = 0;
        client.events.register(EndpointRegisterEvent, EndpointCallEvent, EndpointReceiveEvent, EndpointErrorEvent);
        client.events.addListener(EndpointReceiveEvent, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.resolve(event.data);
        });
        client.events.addListener(EndpointErrorEvent, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.reject(new Error(event.error));
        });
    }

    register<Req, Res>(type: EndpointType<Req, Res>): void {
        if (this.endpointMap.has(type.type)) {
            throw new Error(`Endpoint for key ${type.type} already registered`);
        }
        this.endpointMap.set(type.type, type);
    }

    async call<Req, Res>(endpoint: EndpointType<Req, Res>, data: Req): Promise<Res> {
        try {
            const id = this.callId++;
            const promise = new Promise<Uint8Array>((resolve, reject) => {
                this.promiseMap.set(id, { resolve, reject });
            });
            this.client.send(EndpointCallEvent, {
                type: endpoint.type,
                id,
                data: endpoint.requestSerializer.serialize(data),
            });
            const response = await promise;
            return endpoint.responseSerializer.deserialize(response);
        } catch (e) {
            throw new Error(`Failed to call endpoint ${endpoint.type}: ${e}`);
        }
    }
}

export const EndpointExtensionType = defineExtensionType('endpoint', {
    create: (client: Client) => new EndpointExtension(client),
});

export const EndpointRegisterEvent = JsonEventType.ofExtension<EndpointInfo>(EndpointExtensionType, {
    name: 'register',
});
type EndpointReq = {
    type: string;
    id: number;
}

// python side:
// class CallSerializer(Serializable[EndpointDataReq, bytes]):
//     def serialize(self, data: EndpointDataReq) -> bytes:
//         # type_length, type, id_length, id, data
//         type_buff = data["type"].encode("utf-8")
//         type_length = struct.pack("B", len(type_buff))
//         id_buff = struct.pack("I", data["id"])
//         id_length = struct.pack("B", len(id_buff))
//         return type_length + type_buff + id_length + id_buff + data["data"]

//     def deserialize(self, data: bytes) -> EndpointDataReq:
//         type_length = struct.unpack("B", data[:1])[0]
//         type_buff = data[1 : type_length + 1]
//         type = type_buff.decode("utf-8")
//         id_length = struct.unpack("B", data[type_length + 1 : type_length + 2])[0]
//         id_buff = data[type_length + 2 : type_length + 2 + id_length]
//         id = struct.unpack("I", id_buff)[0]
//         data = data[type_length + 2 + id_length :]
//         return EndpointDataReq(type=type, id=id, data=data)

// CALL_SERIALIZER = CallSerializer()

// EndpointCallEvent = SerializeEventType[EndpointDataReq].of_extension(
//     EndpointExtensionType,
//     "call",
//     CALL_SERIALIZER,
// )
// EndpointReceiveEvent = SerializeEventType[EndpointDataReq].of_extension(
//     EndpointExtensionType,
//     "receive",
//     CALL_SERIALIZER,
// )
// EndpointErrorEvent = JsonEventType[EndpointError].of_extension(
//     EndpointExtensionType,
//     "error",
// )
// EndpointsTableType = ModelTableType.of_extension(
//     EndpointExtensionType,
//     "endpoints",
//     EndpointInfo,
// )
type EndpointReqData = {
    type: string;
    id: number;
    data: Uint8Array;
}
const serializer = new Serializer<EndpointReqData, Uint8Array>(
    (data) => {
        const typeBuff = textEncoder.encode(data.type);
        const typeLength = new Uint8Array([typeBuff.length]);
        const idBuff = new Uint8Array(4);
        new DataView(idBuff.buffer).setUint32(0, data.id, true);
        const idLength = new Uint8Array([idBuff.length]);
        return new Uint8Array([
            ...typeLength,
            ...typeBuff,
            ...idLength,
            ...idBuff,
            ...data.data,
        ]);
    },
    (data) => {
        const typeLength = data[0];
        const typeBuff = data.slice(1, typeLength + 1);
        const type = textDecoder.decode(typeBuff);
        const idLength = data[typeLength + 1];
        const idBuff = data.slice(typeLength + 2, typeLength + 2 + idLength);
        const id = new DataView(idBuff.buffer).getUint32(0, true);
        const dataBuff = data.slice(typeLength + 2 + idLength);
        return {
            type,
            id,
            data: dataBuff,
        };
    },
);

export const EndpointCallEvent = SerializeEventType.ofExtension<EndpointReqData>(EndpointExtensionType, {
    name: 'call',
    serializer,
});
export const EndpointReceiveEvent = SerializeEventType.ofExtension<EndpointReqData>(EndpointExtensionType, {
    name: 'receive',
    serializer,
});
export const EndpointErrorEvent = JsonEventType.ofExtension<EndpointReq & { error: string }>(EndpointExtensionType, {
    name: 'error',
});
export const EndpointsTableType = ModelTableType.ofExtension(EndpointExtensionType, {
    name: 'endpoints',
    model: EndpointInfo,
});
