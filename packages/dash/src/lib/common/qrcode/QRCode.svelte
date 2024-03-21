<script lang="ts">
    import QrCode from 'qrious';
    import { onMount } from 'svelte';

    const qrCode = new QrCode();

    export let errorCorrection: string = 'L';
    export let background: string = 'transparent';
    export let color: string = '#000';
    export let size: number = 200;
    export let value: string = '';
    export let padding: number = 0;
    export let className: string = 'qrcode';
    export let qrImage: HTMLImageElement | undefined;

    let image = '';

    function generateQrCode() {
        qrCode.set({
            background,
            foreground: color,
            level: errorCorrection,
            padding,
            size,
            value,
        });

        image = qrCode.toDataURL('image/png');
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
