import type { Model } from '@omuchatjs/omu/interface/index.js';

export type ContentJson = RootContentJson | TextContentJson | ImageContentJson;
export type Content = RootContent | TextContent | ImageContent;

export interface ContentComponentJson<T extends string = string> {
    type: T;
    siblings?: ContentJson[];
}

export class ContentComponent implements Model<ContentComponentJson> {
    protected constructor(
        public type: string,
        public siblings?: ContentComponent[],
    ) {}

    static fromJson(json: ContentJson): Content {
        switch (json.type) {
            case 'text':
                return TextContent.fromJson(json);
            case 'image':
                return ImageContent.fromJson(json);
            case 'root':
                return RootContent.fromJson(json);
            default:
                throw new Error(`Unknown content type ${json}`);
        }
    }

    toJson(): ContentJson {
        throw new Error('Not implemented');
    }

    walk(cb: (content: ContentComponent) => void): void {
        cb(this);
        this.siblings?.forEach(s => s.walk(cb));
    }
}

export interface RootContentJson extends ContentComponentJson<'root'> {}

export class RootContent extends ContentComponent implements Model<RootContentJson> {
    constructor(
        siblings?: ContentComponent[],
    ) {
        super('root', siblings);
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(info: RootContentJson): RootContent {
        return new RootContent(info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(siblings?: ContentComponent[]): RootContent {
        return new RootContent(siblings);
    }

    toJson(): RootContentJson {
        return {
            type: 'root',
            siblings: this.siblings?.map(s => s.toJson()),
        };
    }
}

export interface TextContentJson extends ContentComponentJson<'text'> {
    text: string;
}

export class TextContent extends ContentComponent implements Model<TextContentJson> {
    constructor(
        public text: string,
        siblings?: Content[],
    ) {
        super('text', siblings);
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(info: TextContentJson): TextContent {
        return new TextContent(info.text, info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(text: string): TextContent {
        return new TextContent(text);
    }

    toJson(): TextContentJson {
        return {
            type: 'text',
            text: this.text,
            siblings: this.siblings?.map(s => s.toJson()),
        };
    }
}

export interface ImageContentJson extends ContentComponentJson<'image'> {
    url: string;
    id: string;
    name?: string;
}

export class ImageContent extends ContentComponent implements Model<ImageContentJson> {
    constructor(
        public url: string,
        public id: string,
        public name?: string,
        siblings?: Content[],
    ) {
        super('image', siblings);
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(info: ImageContentJson): ImageContent {
        return new ImageContent(info.url, info.id, info.name, info.siblings?.map(s => ContentComponent.fromJson(s)));
    }

    static of(url: string, id: string, name?: string): ImageContent {
        return new ImageContent(url, id, name);
    }

    toJson(): ImageContentJson {
        return {
            type: 'image',
            url: this.url,
            id: this.id,
            name: this.name,
            siblings: this.siblings?.map(s => s.toJson()),
        };
    }
}
