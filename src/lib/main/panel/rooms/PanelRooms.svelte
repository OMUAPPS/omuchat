<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { onMount } from 'svelte';

    import RoomEntry from './RoomEntry.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';

    export let filter: (key: string, room: models.Room) => boolean = (_, room) => true;

    const { chat, client } = getClient();
    let rooms = chat.rooms!.cache;

    const destroy = chat.rooms.listen((newRooms: Map<string, models.Room>) => {
        rooms = newRooms;
    });
    client.connection.addListener({
        onConnect() {
            chat.rooms.fetch({
                after: 100,
            });
        },
    });
    onMount(() => {
        return destroy;
    });

    function openSetup() {
        screenContext.push({
            component: ScreenSetup,
            props: {},
        });
    }
</script>

<div class="rooms">
    {#if rooms.size > 0}
        <TableList table={chat.rooms} component={RoomEntry} {filter} />
    {:else}
        <div class="empty">
            ルームが見つかりません！
            <Button on:click={openSetup}>
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
        height: 100%;
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
