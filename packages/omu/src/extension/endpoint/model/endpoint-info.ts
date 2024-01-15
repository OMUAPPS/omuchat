import type { Keyable, Model } from '../../../interface/index.js';
import type { ExtensionType } from '../../extension.js';

export interface EndpointInfoJson {
    owner: string;
    name: string;
    description?: string;
}

export class EndpointInfo implements Keyable, Model<EndpointInfoJson> {
    constructor(
        public owner: string,
        public name: string,
        public description?: string,
    ) {}

    static fromJson(json: EndpointInfoJson): EndpointInfo {
        return new EndpointInfo(json.owner, json.name, json.description);
    }

    static create(extensionType: ExtensionType, name: string, description?: string): EndpointInfo {
        return new EndpointInfo(extensionType.key, name, description);
    }

    key(): string {
        return `${this.owner}:${this.name}`;
    }

    toJson(): EndpointInfoJson {
        return {
            owner: this.owner,
            name: this.name,
            description: this.description,
        };
    }
}
