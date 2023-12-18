<script lang="ts">
    import type { models } from '@omuchat/client';
    
import ChannelEntry from './ChannelEntry.svelte';
import ScreenAddChannel from './ScreenAddChannel.svelte';

    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';

    export let filter: (key: string, message: models.Channel) => boolean = () => true;

    const { chat } = getClient();

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
        <ButtonMini on:click={openAddScreen}>
            <i class="ti ti-plus" />
            追加する
        </ButtonMini>
        <ButtonMini on:click={openSetupScreen}>
            簡単セットアップ
            <i class="ti ti-external-link" />
        </ButtonMini>
    </div>
    <TableList table={chat.channels} component={ChannelEntry} filter={filter} />
</div>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-top: 40px;
        overflow: auto;
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
