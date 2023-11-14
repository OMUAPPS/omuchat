<script lang="ts">
    import QrCode from 'qrious';
    import { onMount } from 'svelte';

    const QRcode = new QrCode();

    export let errorCorrection: string = 'L';
    export let background: string = 'transparent';
    export let color: string = '#000';
    export let size: number = 200;
    export let value: string = '';
    export let padding: number = 0;
    export let className: string = 'qrcode';
    export let qrImage: HTMLImageElement | null = null;

    let image = '';

    function generateQrCode() {
        QRcode.set({
            background,
            foreground: color,
            level: errorCorrection,
            padding,
            size,
            value
        });

        image = QRcode.toDataURL('image/png');
    }

    export function getImage() {
        return image;
    }

    $: {
        if (value) {
            generateQrCode();
        }
    }

    onMount(() => {
        generateQrCode();
    });
</script>

<img src={image} alt={value} class={className} width={size} height={size} bind:this={qrImage} />
