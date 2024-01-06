<script lang="ts">
    import type { models } from '@omuchat/client';
    import { onMount } from 'svelte';

    import ChannelEntry from './ChannelEntry.svelte';
    import ScreenAddChannel from './ScreenAddChannel.svelte';

    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
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

    let checkIntervalLeft = 0;

    onMount(() => {
        const interval = setInterval(() => {
            checkIntervalLeft = 15 - new Date().getTime() / 1000 % 15;
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="container">
    <div class="buttons">
        <ButtonMini on:click={openAddScreen}>
            <Tooltip>
                追加する
            </Tooltip>
            <i class="ti ti-plus" />
        </ButtonMini>
        <ButtonMini on:click={openSetupScreen}>
            <Tooltip>
                簡単セットアップ
            </Tooltip>
            <i class="ti ti-external-link" />
        </ButtonMini>
        <ButtonMini on:click={() => {}}>
            <Tooltip>
                今すぐチャンネルを再チェックする
            </Tooltip>
            <i class="ti ti-reload"/>
        </ButtonMini>
        <small>
            <Tooltip>
                再チェックまであと
                {Math.floor(checkIntervalLeft)}秒
            </Tooltip>
            {Math.floor(checkIntervalLeft)}
        </small>
    </div>
    <TableList table={chat.channels} component={ChannelEntry} {filter} />
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
        width: 100%;
        height: 40px;
        padding: 0 5px;
        outline: 1px solid var(--color-bg-1);

        small {
            padding: 5px;
            font-size: 12px;
            color: color-mix(in srgb, var(--color-text) 50%, transparent 0%);
        }
    }
</style>
