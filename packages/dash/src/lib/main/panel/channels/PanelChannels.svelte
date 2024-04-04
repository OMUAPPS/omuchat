<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { onMount } from 'svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import ChannelEntry from './ChannelEntry.svelte';
    import ScreenAddChannel from './ScreenAddChannel.svelte';

    import { chat } from '$lib/common/omuchat/client.js';
    import { screenContext } from '$lib/common/screen/screen.js';
    import ScreenSetup from '$lib/main/setup/ScreenSetup.svelte';
    import { ButtonMini, TableList, Tooltip } from '@omuchatjs/ui';

    export let filter: (key: string, message: models.Channel) => boolean = () => true;

    function openSetupScreen() {
        screenContext.push(ScreenSetup, {});
    }

    function openAddScreen() {
        screenContext.push(ScreenAddChannel, {});
    }

    let checkIntervalLeft = 0;

    onMount(() => {
        const interval = setInterval(() => {
            checkIntervalLeft = 15 - ((new Date().getTime() / 1000) % 15);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="container">
    <div class="buttons">
        <ButtonMini on:click={openAddScreen}>
            <Tooltip>{$t('panels.channels.append_channel')}</Tooltip>
            <i class="ti ti-plus" />
        </ButtonMini>
        <ButtonMini on:click={openSetupScreen}>
            <Tooltip>{$t('panels.channels.setup_channel')}</Tooltip>
            <i class="ti ti-external-link" />
        </ButtonMini>
        <small>
            <Tooltip>
                {$t('panels.channels.next_check')}
                {Math.floor(checkIntervalLeft)}
                {$t('general.second')}
            </Tooltip>
            <i class="ti ti-reload" />
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
