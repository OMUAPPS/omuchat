<script lang="ts">
    import type { Channel } from '@omuchat/client';
    
    import ChannelEntry from './ChannelEntry.svelte';
    import ScreenAddChannel from './ScreenAddChannel.svelte';

    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';

    export let filter: (message: Channel) => boolean = () => true;

    const { chat } = getClient();

    let channels = [...chat.channels!.cache.values()];

    chat.channels!.addListener({
        onCacheUpdate(cache) {
            channels = [...cache.values()];
        },
    });

    chat.channels!.fetch(100);

    function openSetupScreen() {
        screenContext.push({
            component: ScreenSetup,
            props: {}
        });
    }

    function openAddScreen() {
        screenContext.push({
            component: ScreenAddChannel,
            props: {}
        });
    }
</script>

<div class="container">
    <div class="buttons">
        <ButtonMini callback={openAddScreen}>
            <i class="ti ti-plus" />
            追加する
        </ButtonMini>
        <ButtonMini callback={openSetupScreen}>
            簡単セットアップ
            <i class="ti ti-external-link" />
        </ButtonMini>
    </div>
    {#each Object.values(channels).filter(filter) as channel (channel.url)}
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
        padding: 0 5px;
        outline: 1px solid var(--color-bg-1);
    }
</style>
