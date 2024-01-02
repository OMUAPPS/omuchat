<script lang="ts">
    import { onMount } from 'svelte';

    import Background from '$lib/common/Background.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import Screen from '$lib/common/screen/Screen.svelte';
    import { invoke, listen } from '$lib/utils/tauri';

    let progress: {
        progress: number;
        total: number;
        progress_text: string;
    } | null = null;

    onMount(async () => {
        listen('install-progress', (progress) => {
            console.log(progress);
            progress = progress;
        });
        const state = await invoke('get_server_state');
        if (state === 'Installed') {
            screenContext.pop();
        }
        listen('server-state', (state) => {
            if (state === 'Installed') {
                screenContext.pop();
            }
        });
    });
</script>

<Screen title="installing" windowed={false} noDecorated>
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
                    <div class="progress-text">{progress.progress_text}</div>
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
