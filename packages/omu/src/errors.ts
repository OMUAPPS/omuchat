import { DisconnectType } from "./network/packet/packet-types.js";
export class OmuError extends Error {
    constructor(message: string | null) {
        super(message ?? undefined);
        this.name = this.constructor.name;
    }
}

export class DisconnectReason {
    constructor(
        public type: DisconnectType,
        public message: string | null = null,
    ) {
    }
}

export class NetworkError extends OmuError {
}

export class AnotherConnection extends NetworkError {
    constructor() {
        super(DisconnectType.ANOTHER_CONNECTION);
    }
}

export class PermissionDenied extends NetworkError {
    constructor() {
        super(DisconnectType.PERMISSION_DENIED);
    }
}

export class InvalidToken extends NetworkError {
    constructor() {
        super(DisconnectType.INVALID_TOKEN);
    }
}

export class InvalidOrigin extends NetworkError {
    constructor() {
        super(DisconnectType.INVALID_ORIGIN);
    }
}

export class InvalidVersion extends NetworkError {
    constructor() {
        super(DisconnectType.INVALID_VERSION);
    }
}

export class InvalidPacket extends NetworkError {
}
