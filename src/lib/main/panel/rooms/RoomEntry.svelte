<script lang="ts">
    import type { RoomInfo } from '@omuchat/client';

    import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { ClipboardHelper } from '$lib/util/clipboard-helper';

    export let room: RoomInfo;

    function open() {
        window.open(room.url, '_blank');
    }

    function copyViewers() {
        if (!room.viewers) return;
        ClipboardHelper.writeText(room.viewers.toString());
    }
</script>

<div class="room">
    <div class="top">
        <img src={room.image_url} alt="thumbnail" class="room-thumbnail" />
        <div class="buttons">
            <FlexRowWrapper widthFull reverse>
                <ButtonMini callback={open}>
                    <Tooltip>見る</Tooltip>
                    <i class="ti ti-external-link" />
                </ButtonMini>
            </FlexRowWrapper>
            <FlexRowWrapper widthFull reverse between>
                <ButtonMini callback={copyViewers}>
                    <Tooltip>視聴者数（クリックでコピー）</Tooltip>
                    {room.viewers}
                    <i class="ti ti-user" />
                </ButtonMini>
                <i class={`online-state ti ti-bolt ${room.online ? 'online' : 'offline'}`}>
                    <Tooltip>{room.online ? 'オンライン' : 'オフライン'}</Tooltip>
                </i>
            </FlexRowWrapper>
        </div>
    </div>
    <div class="bottom">
        <div class="room-name">
            <Tooltip>
                {room.name}
            </Tooltip>
            {room.name}
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
        object-fit: contain;
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
