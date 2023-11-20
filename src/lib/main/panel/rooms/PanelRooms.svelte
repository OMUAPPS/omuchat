<script lang="ts">
    import type { Room } from '@omuchat/client';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import RoomEntry from './RoomEntry.svelte';

    import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
    import Button from '$lib/common/input/Button.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';

    export let filter: (message: Room) => boolean = () => true;

    const { chat } = getClient();
    const rooms = writable(chat.rooms!.cache);
    let showOffline = false;

    function update(newRooms: Map<string, Room>) {
        rooms.set(newRooms);
    }

    chat.rooms!.on({
        onCacheUpdate(cache) {
            update(cache);
        },
    });

    function toggleOffline() {
        showOffline = !showOffline;
    }

    onMount(async () => {
        update(await chat.rooms!.fetch(100));
    });

    function openSetup() {
        screenContext.push({
            component: ScreenSetup,
            props: {}
        });
    }
</script>

<div class="rooms">
    {#if $rooms.size > 0}
        {#each [...$rooms.values()].filter(filter || (() => true)) as room}
            <RoomEntry {room} />
        {/each}
        {#if [...$rooms.values()].some((room) => !room.online)}
            <Button callback={toggleOffline}>
                <FlexRowWrapper widthFull reverse>
                    {#if showOffline}
                        <i class="ti ti-chevron-up" />
                        オンラインのみ表示
                    {:else}
                        <i class="ti ti-chevron-down" />
                        オフラインも表示する
                    {/if}
                </FlexRowWrapper>
            </Button>
        {/if}
        {#if showOffline}
            {#each [...$rooms.values()].filter((room) => !room.online) as room}
                <RoomEntry {room} />
            {/each}
        {/if}
    {:else}
        <div class="empty">
            ルームが見つかりません！
            <Button callback={openSetup}>
                チャンネルを追加しますか？
                <i class="ti ti-external-link" />
            </Button>
        </div>
    {/if}
</div>

<style lang="scss">
    .rooms {
        display: flex;
        flex-direction: column;
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 40px 0;
    }
</style>
