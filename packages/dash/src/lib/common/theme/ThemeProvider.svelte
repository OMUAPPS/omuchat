<script lang="ts">
    import { theme } from './theme.js';
</script>

<svelte:element this="style">
    {`
        :root {
            ${Object.entries($theme)
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n')}
        }
    `}
</svelte:element>
