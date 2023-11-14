<script lang="ts">
    import type { ChannelInfo } from '@omuchat/client';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import ChannelEntry from './ChannelEntry.svelte';

    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { getClient } from '$lib/common/omuchat/omuchat';
    import { screenContext } from '$lib/common/screen/screen';
    import PopupSetup from '$lib/main/setup/PopupSetup.svelte';

    export let filter: (message: ChannelInfo) => boolean = () => true;

    const client = getClient();

    const channels = writable(client.channels.cache);

    client.channels.listen((newChannels) => {
        channels.set(newChannels);
    });

    onMount(async () => {
        channels.set(await client.channels.fetch());
    });

    function openSetup() {
        screenContext.push({
            component: PopupSetup,
            props: {}
        });
    }
</script>

<div class="container">
    <div class="buttons">
        <ButtonMini>
            <i class="ti ti-plus" />
            追加する
        </ButtonMini>
        <ButtonMini callback={openSetup}>
            <i class="ti ti-plus" />
            簡単セットアップ
        </ButtonMini>
    </div>
    {#each Object.values($channels).filter(filter) as channel}
        <ChannelEntry {channel} />
    {/each}
</div>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        padding-top: 40px;
    }

    .buttons {
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        padding: 0 10px;
        outline: 1px solid var(--color-bg-1);
    }
</style>
