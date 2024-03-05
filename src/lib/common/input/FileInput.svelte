<script lang="ts">
    export let handle: (files: Map<string, Uint8Array>) => void;
    export let accept: string = 'image/*';
    export let multiple: boolean = false;

    async function handleChange(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (!files) return;
        const map = new Map<string, Uint8Array>();
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) continue;
            const arrayBuffer = await file.arrayBuffer();
            map.set(file.name, new Uint8Array(arrayBuffer));
        }
        handle(map);
    }

    let input: HTMLInputElement;
</script>

<input type="file" {accept} {multiple} bind:this={input} on:change={handleChange} hidden />
<button on:click={() => input.click()}>
    <slot />
</button>

<style>
    button {
        padding: 0;
        margin: 0;
        appearance: none;
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
    }
</style>
