export class ClipboardHelper {
    static writeImage(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get canvas context');
        }
        context.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Failed to get blob');
            }
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
        });
    }

    static writeText(text: string) {
        navigator.clipboard.writeText(text);
    }
}
