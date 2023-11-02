import { ImageComponent, TextComponent } from "./model";

export class ComponentFactory {
    text({ value }: { value: string }): TextComponent {
        return {
            type: 'text',
            value,
        }
    }

    image({ url, id }: { url: string, id?: string }): ImageComponent {
        return {
            type: 'image',
            value: url,
            id,
        }
    }
}