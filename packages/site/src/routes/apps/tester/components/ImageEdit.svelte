<script lang="ts">
    import type { content } from '@omuchatjs/chat/models/index.js';

    export let component: content.Image;
</script>

<span>
    <input type="text" bind:value={component.url} />
    <img src={component.url} alt="" />
</span>
