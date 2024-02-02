<script lang="ts">
    import { theme } from "./theme.js";
</script>

<svelte:head>
    <svelte:element this="style">
        :root {'{'}
            {Object.entries($theme).map(([key, value]) => `${key}: ${value};`).join('\n')}
        {'}'}
    </svelte:element>
</svelte:head>
