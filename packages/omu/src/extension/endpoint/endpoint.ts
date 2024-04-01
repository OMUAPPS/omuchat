import type { Identifier } from '../../identifier.js';
import { Serializer, type Serializable } from '../../serializer.js';

export class EndpointType<Req = unknown, Res = unknown> {
    constructor(
        public readonly identifier: Identifier,
        public readonly requestSerializer: Serializable<Req, Uint8Array>,
        public readonly responseSerializer: Serializable<Res, Uint8Array>,
    ) { }

    static createJson<Req, Res>(
        identifier: Identifier,
        {
            name,
            requestSerializer,
            responseSerializer,
        }: {
            name: string,
            requestSerializer?: Serializable<Req, any>,
            responseSerializer?: Serializable<Res, any>,
        },
    ): EndpointType<Req, Res> {
        return new EndpointType<Req, Res>(
            identifier.join(name),
            Serializer.of<Req, any>(requestSerializer ?? Serializer.noop())
                .pipe(Serializer.json()),
            Serializer.of<Res, any>(responseSerializer ?? Serializer.noop())
                .pipe(Serializer.json()),
        );
    }

    static createSerialized<Req, Res>(
        identifier: Identifier,
        {
            name,
            requestSerializer,
            responseSerializer,
        }: {
            name: string,
            requestSerializer: Serializable<Req, Uint8Array>,
            responseSerializer: Serializable<Res, Uint8Array>,
        },
    ): EndpointType<Req, Res> {
        return new EndpointType<Req, Res>(
            identifier.join(name),
            requestSerializer,
            responseSerializer,
        );
    }
}

