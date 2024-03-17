<script lang="ts">
    import { onMount } from 'svelte';

    import { installed } from '../settings.js';

    import ScreenSetup from './ScreenSetup.svelte';

    import Background from '$lib/common/Background.svelte';
    import { screenContext, type ScreenHandle } from '$lib/common/screen/screen.js';
    import Screen from '$lib/common/screen/Screen.svelte';
    import { invoke, listen } from '$lib/utils/tauri.js';

    export let screen: ScreenHandle;

    let progress: {
        progress: number;
        total: number;
        message: string;
    } | null = null;

    function close() {
        screen.pop();
        if (!$installed) {
            screenContext.push(ScreenSetup, {});
        }
    }

    onMount(async () => {
        listen('install-progress', (event) => {
            progress = event.payload;
        });
        const state = await invoke('get_server_state');
        if (state === 'Installed' || state === 'AlreadyRunning') {
            close();
        }
        listen('server-state', (state) => {
            if (state.payload === 'Installed') {
                close();
            }
        });
    });
</script>

<Screen {screen} title="installing" windowed={false} noDecorated>
    <div class="background">
        <Background />
    </div>
    <div class="container">
        <div class="content">
            <div class="title">
                <i class="ti ti-download" />
                インストール中
                {#if progress}
                    <div class="progress">
                        <div
                            class="progress-bar"
                            style="width: {(progress.progress / progress.total) * 100}%"
                        ></div>
                    </div>
                    <div class="progress-text">{progress.message}</div>
                {/if}
            </div>
        </div>
    </div>
</Screen>

<style lang="scss">
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--color-bg-2);
    }

    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--color-text);
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
        width: 500px;
        min-height: 250px;
        padding: 20px;
        background: var(--color-bg-2);
    }

    .title {
        padding: 5px 10px;
        font-size: 24px;
        font-weight: bold;
    }
</style>
