<script lang="ts">
    import { Tooltip } from '@omujs/ui';

    export let href: string = '';
    export let title: string | undefined = undefined;

    if (href?.length && !href.startsWith('http')) {
        href = `https://${href}`;
    }
</script>

<a target="_blank" {href} {title}>
    <Tooltip>
        {href}
    </Tooltip>
    <slot />
</a>
