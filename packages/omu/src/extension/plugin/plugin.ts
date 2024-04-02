import { Identifier } from '../../identifier.js';
import type { Model } from '../../model.js';

export type PluginMetadata = {
    dependencies: Record<string, string>;
    module: string;
    isolated: boolean;
}

export type PluginJson = {
    identifier: string;
    metadata: PluginMetadata;
};

export class PluginType implements Model<PluginJson> {
    public readonly identifier: Identifier;
    public readonly metadata: PluginMetadata;

    constructor({
        identifier,
        metadata,
    }: {
        identifier: Identifier;
        metadata: PluginMetadata;
    }) {
        this.identifier = identifier;
        this.metadata = metadata;
    }

    public static create(identifier: Identifier, {
        name,
        metadata,
    }: {
        name: string;
        metadata: PluginMetadata;
    }): PluginType {
        return new PluginType({
            identifier: identifier.join(name),
            metadata,
        });
    }

    public toJson(): PluginJson {
        return {
            identifier: this.identifier.key(),
            metadata: this.metadata,
        };
    }

    public static fromJson(json: PluginJson): PluginType {
        return new PluginType({
            identifier: Identifier.fromKey(json.identifier),
            metadata: json.metadata,
        });
    }
}
