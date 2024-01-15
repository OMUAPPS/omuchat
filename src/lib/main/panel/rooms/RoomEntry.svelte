<script lang="ts">
    import type { models } from '@omuchat/client';

    import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { ClipboardHelper } from '$lib/utils/clipboard-helper.js';

    export let entry: models.Room;

    const { client } = getClient();

    function open() {
        window.open(entry.url, '_blank');
    }

    function copyViewers() {
        if (!entry.viewers) return;
        ClipboardHelper.writeText(entry.viewers.toString());
    }
</script>

<div class="room">
    <div class="top">
        <div>
            {#if entry.image_url}
                <img src={client.proxy(entry.image_url)} alt="thumbnail" class="room-thumbnail">
                <Tooltip noBackground>
                    <img src={client.proxy(entry.image_url)} alt="thumbnail" class="room-thumbnail-preview">
                </Tooltip>
            {/if}
        </div>
        <div class="buttons">
            <FlexRowWrapper widthFull reverse>
                <ButtonMini on:click={open}>
                    <Tooltip>見る</Tooltip>
                    <i class="ti ti-external-link" />
                </ButtonMini>
            </FlexRowWrapper>
            <FlexRowWrapper widthFull reverse between>
                <ButtonMini on:click={copyViewers}>
                    <Tooltip>視聴者数（クリックでコピー）</Tooltip>
                    {entry.viewers}
                    <i class="ti ti-user" />
                </ButtonMini>
                <i class={`online-state ti ti-bolt ${entry.online ? 'online' : 'offline'}`}>
                    <Tooltip>{entry.online ? 'オンライン' : 'オフライン'}</Tooltip>
                </i>
            </FlexRowWrapper>
        </div>
    </div>
    <div class="bottom">
        <div class="room-name">
            <Tooltip>
                {entry.name}
            </Tooltip>
            {entry.name}
        </div>
    </div>
</div>

<style lang="scss">
    .room {
        padding: 10px;
        background: var(--color-bg-2);

        &:hover {
            background: var(--color-bg-1);
        }

        border-bottom: 1px solid var(--color-bg-1);
    }

    .top {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 20px;
        margin-left: 5px;
    }

    .online-state {
        margin-left: 5px;
    }

    .online {
        color: var(--color-1);
    }

    .offline {
        color: #ccc;
    }

    .room-thumbnail {
        width: 100px;
        min-width: 100px;
        min-height: 56px;
        object-fit: contain;
    }

    .room-thumbnail-preview {
        width: 300px;
        object-fit: contain;
        outline: 2px solid #000;
    }

    .room-name {
        display: -webkit-box;
        overflow: hidden;
        font-size: 12px;
        color: rgba($color: #000, $alpha: 50%);
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
</style>
