<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { onMount } from 'svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import RoomEntry from './RoomEntry.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';

    export let filter: (key: string, room: models.Room) => boolean = (_, room) => true;
    export let sort: (a: models.Room, b: models.Room) => number = (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.getTime() - b.createdAt.getTime();
    };

    const { chat, client } = getClient();
    let rooms = chat.rooms!.cache;

    const unlisten = chat.rooms.listen((newRooms: Map<string, models.Room>) => {
        rooms = newRooms;
    });

    onMount(() => {
        client.network.listeners.connected.subscribe(() => {
            chat.rooms.fetch({
                after: 100,
            });
        });
        return () => {
            unlisten();
        };
    });

    function openSetup() {
        screenContext.push(ScreenSetup, {});
    }
</script>

<div class="rooms">
    {#if rooms.size > 0}
        <TableList table={chat.rooms} component={RoomEntry} {filter} {sort} />
    {:else}
        <div class="empty">
            {$t('panels.rooms.not_found_rooms')}
            <Button on:click={openSetup}>
                {$t('panels.rooms.question_add_channel')}
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
