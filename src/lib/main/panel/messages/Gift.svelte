<script lang="ts">
    import type { models } from '@omuchat/client';

    import { getClient } from '$lib/common/omuchat/client.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';

    export let gift: models.Gift;

    const { client } = getClient();
</script>

<div class="gift">
    <Tooltip>
        {gift.name}
        <small>
            id: {gift.id}
        </small>
    </Tooltip>
    <div class="image">
        {#if gift.image_url}
            <img src={client.proxy(gift.image_url)} alt="gift" width="32" height="32" />
        {:else}
            {gift.name}
        {/if}
    </div>
    <div class="info">
        {gift.name}
        {gift.amount > 1 ? `x${gift.amount}` : ''}
    </div>
</div>

<style lang="scss">
    .gift {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        min-width: 90px;
        height: 90px;
        padding: 5px 10px;

        .image {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60px;
            font-size: 24px;
        }

        img {
            width: 60px;
            height: 60px;
        }

        .info {
            height: 20px;
            font-size: 12px;
            font-weight: bold;
            color: var(--color-1);
            white-space: nowrap;
        }

        &:hover {
            background: var(--color-bg-1);
        }
    }

    small {
        display: block;
        margin-top: 4px;
        font-size: 10px;
        font-weight: lighter;
    }
</style>
