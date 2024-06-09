export class DragHelper {
    static setDragImage(event: DragEvent, image: Element) {
        event.dataTransfer?.setDragImage(image, 0, 0);
    }

    static setText(event: DragEvent, text: string) {
        event.dataTransfer?.setData('text/plain', text);
    }

    static setUrl(event: DragEvent, url: URL | string) {
        const urlString = typeof url === 'string' ? url : url.toString();
        event.dataTransfer?.setData('text/uri-list', urlString);
    }

    static setImageUrl(event: DragEvent, url: string) {
        event.dataTransfer?.setData('text/html', `<img src="${url}">`);
    }
}
