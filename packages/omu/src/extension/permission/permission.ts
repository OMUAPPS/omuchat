import { Identifier } from '../../identifier.js';
import type { Model } from '../../model.js';

export type PermissionTypeJson = {
    identifier: string;
}

export class PermissionType implements Model<PermissionTypeJson> {
    public readonly identifier: Identifier;

    constructor(options: {
        identifier: Identifier,
    }) {
        this.identifier = options.identifier;
    }

    static create(identifier: Identifier, {
        name,
    }: {
        name: string,
    }): PermissionType {
        return new PermissionType({
            identifier: identifier.join(name),
        });
    }

    public toJson(): PermissionTypeJson {
        return {
            identifier: this.identifier.key(),
        };
    }

    static fromJson(json: PermissionTypeJson): PermissionType {
        return new PermissionType({
            identifier: Identifier.fromKey(json.identifier),
        });
    }
}
