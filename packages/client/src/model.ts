import type { Client } from "./omuchat";

export type ModelJson<T> = {
    [K in keyof T]: T[K];
};

export interface Keyable {
    key(): string;
    toJSON(): unknown;
}

export interface Id {
    id: string;
}

export interface OptionalId {
    id?: string | null;
}

export class ListInfo implements Keyable {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description?: string | null,
    ) {}

    key(): string {
        return this.id;
    }

    toJSON(): unknown {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
        };
    }
}

export class ProxyInfo implements Keyable {
    constructor(
        readonly plugin_id: string,
        readonly priority: number,
        readonly target: string,
    ) {}

    key(): string {
        return this.plugin_id;
    }

    toJSON(): unknown {
        return {
            plugin_id: this.plugin_id,
            priority: this.priority,
            target: this.target,
        };
    }
}

export class ProxyListInfo implements Keyable {
    constructor(
        readonly proxies: Record<string, ProxyInfo>,
        readonly target: string,
    ) {}

    key(): string {
        return this.target;
    }

    toJSON(): unknown {
        return {
            proxies: this.proxies,
            target: this.target,
        };
    }
}

export class PluginInfo implements Keyable {
    constructor(
        readonly name: string,
        readonly group: string,
        readonly version: string,
        readonly description?: string | null,
        readonly authors?: string[] | null,
        readonly site_url?: string | null,
        readonly repository_url?: string | null,
        readonly image_url?: string | null,
    ) {}

    key(): string {
        return this.name;
    }

    toJSON(): unknown {
        return {
            name: this.name,
            group: this.group,
            version: this.version,
            description: this.description,
            authors: this.authors,
            site_url: this.site_url,
            repository_url: this.repository_url,
            image_url: this.image_url,
        };
    }

    static fromJSON(json: ModelJson<PluginInfo>): PluginInfo {
        return new PluginInfo(
            json.name,
            json.group,
            json.version,
            json.description,
            json.authors,
            json.site_url,
            json.repository_url,
            json.image_url,
        );
    }

    static create({
        name,
        group,
        version,
        description,
        authors,
        site_url,
        repository_url,
        image_url,
    }: {
        name: string;
        group: string;
        version: string;
        description?: string | null;
        authors?: string[] | null;
        site_url?: string | null;
        repository_url?: string | null;
        image_url?: string | null;
    }): PluginInfo {
        return new PluginInfo(
            name,
            group,
            version,
            description,
            authors,
            site_url,
            repository_url,
            image_url,
        );
    }
}

export interface Property {
    type: string;
    name: string;
    id: string;
    description?: string | null;
    required: boolean;
}

export interface PropertyString extends Property {
    type: "string";
    value?: string | null;
    regex?: string | null;
}

export interface PropertyNumber extends Property {
    type: "number";
    value: number;
    min?: number | null;
    max?: number | null;
    increment?: number | null;
}

export interface PropertyBoolean extends Property {
    type: "boolean";
    value: boolean;
}

export interface PropertyChoice extends Property {
    type: "choice";
    value: string;
    choices: string[];
}

export interface PropertyColor extends Property {
    type: "color";
    value: string;
}

export interface PropertyImage extends Property {
    type: "image";
    value: string;
}

export interface PropertyFile extends Property {
    type: "file";
    value: string;
}

export interface PropertyList extends Property {
    type: "list";
    value: Property[];
}

export class ProviderInfo implements Keyable, Id {
    constructor(
        readonly id: string,

        readonly site_url: string,
        readonly name: string,
        readonly image_url?: string | null,
        readonly properties?: Property[] | null,
        readonly regex?: string | null,
    ) {}

    key(): string {
        return this.id;
    }

    toJSON(): unknown {
        return {
            id: this.id,
            site_url: this.site_url,
            name: this.name,
            image_url: this.image_url,
            properties: this.properties,
            regex: this.regex,
        };
    }
}

export class RoomInfo implements Keyable, Id {
    constructor(
        readonly id: string,
        readonly provider_id: string,
        readonly channel_id: string,
        readonly online: boolean,
        readonly url: string,
        readonly name: string | null,
        readonly description?: string | null,
        readonly image_url?: string | null,
        readonly viewers?: number | null,
    ) {}

    key(): string {
        return `${this.id}@${this.provider_id}`
    }

    toJSON(): unknown {
        return {
            id: this.id,
            provider_id: this.provider_id,
            channel_id: this.channel_id,
            online: this.online,
            url: this.url,
            name: this.name,
            description: this.description,
            image_url: this.image_url,
            viewers: this.viewers,
        };
    }
}

export class ChannelInfo implements Keyable, Id {
    constructor(
        private readonly client: Client,
        readonly id: string,
        readonly provider_id: string,
        readonly url: string,
        readonly options?: Record<string, any> | null,
        readonly name?: string | null,
        readonly description?: string | null,
        readonly icon_url?: string | null,
    ) {}

    key(): string {
        return this.url;
    }

    toJSON(): unknown {
        return {
            id: this.id,
            provider_id: this.provider_id,
            url: this.url,
            options: this.options,
            name: this.name,
            description: this.description,
            icon_url: this.icon_url,
        };
    }

    static fromJSON(client: Client, json: ModelJson<ChannelInfo>): ChannelInfo {
        return new ChannelInfo(
            client,
            json.id,
            json.provider_id,
            json.url,
            json.options,
            json.name,
            json.description,
            json.icon_url,
        );
    }

    async reload(): Promise<void> {}

    static create(
        client: Client,
        {
            id,
            provider_id,
            url,
            options,
            name,
            description,
            icon_url,
        }: {
            id: string;
            provider_id: string;
            url: string;
            options?: Record<string, any> | null;
            name?: string | null;
            description?: string | null;
            icon_url?: string | null;
        },
    ): ChannelInfo {
        return new ChannelInfo(
            client,
            id,
            provider_id,
            url,
            options,
            name,
            description,
            icon_url,
        );
    }
}

export interface Role extends OptionalId {
    name: string;
    image_url?: string | null;
    is_owner: boolean;
    is_moderator: boolean;
}

export interface Author extends Id {
    id: string;
    name?: string | null;
    image_url?: string | null;
    roles: Role[];
}

export interface Paid {
    amount: number;
    currency: string;
}

export interface Gift extends Id {
    name?: string | null;
    amount: number;
    image_url?: string | null;
    is_paid: boolean;
}

export interface MessageEffect {
    type: string;
}

export interface MessageColorEffect extends MessageEffect {
    type: "color";
    background: string;
    text: string;
}

export interface MessageComponent {
    type: string;
    siblings?: MessageComponent[];
    effects?: MessageEffect[];
}

export interface TextComponent extends MessageComponent {
    type: "text";
    value?: string | null;
}

export interface ImageComponent extends MessageComponent {
    type: "image";
    value: string;
    id?: string;
}

export type MessageComponentType = TextComponent | ImageComponent;

export interface ChatEvent {
    room_id: string;
}

export class Message implements Keyable, ChatEvent, Id {
    constructor(
        readonly id: string,
        readonly room_id: string,

        readonly content?: MessageComponentType | null,
        readonly author?: Author | null,
        readonly paid?: Paid | null,
        readonly gift?: Gift | null,
        readonly created_at?: number | null,
    ) {}

    key(): string {
        return this.id;
    }

    toJSON(): unknown {
        return {
            id: this.id,
            room_id: this.room_id,
            content: this.content,
        };
    }
}

export interface EffectInfo extends ChatEvent, Id {
    effect: string;
}

export class ActionInfo implements Keyable, Id {
    constructor(
        private readonly client: Client,
        readonly id: string,
        readonly name: string,
        readonly type: string,
        readonly description?: string | null,
    ) {}

    async action(args: Record<string, any>): Promise<void> {
        return this.client.send("Action", {
            action: this.id,
            args,
        });
    }

    key(): string {
        return this.id;
    }

    toJSON(): unknown {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
        };
    }
}

export interface OpenUrlAction extends ActionInfo {
    type: "open_url";
    url: string;
}

export interface PluginAction extends ActionInfo {
    type: "plugin";
    plugin_id: string;
    arguments: Record<string, any>;
}

export interface MessageAction extends ActionInfo {
    type: "message";
    message: string;
}
