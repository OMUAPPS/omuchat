<script lang="ts">
    import type { content } from '@omuchatjs/chat/models/index.js';
    import { FlexRowWrapper } from '@omuchatjs/ui';

    export let component: content.Image;
</script>

<FlexRowWrapper>
    <input type="text" bind:value={component.url} placeholder="url" />
    <img src={component.url} alt="" />
</FlexRowWrapper>

<style lang="scss">
    img {
        max-height: 2rem;
    }
    input {
        height: 24px;
    }
</style>
