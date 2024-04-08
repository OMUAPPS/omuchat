<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { listenSync, tauriWindow } from '$lib/utils/tauri.js';
    import { Button, Tooltip } from '@omuchatjs/ui';
    import { TauriEvent } from '@tauri-apps/api/event';
    import { onDestroy } from 'svelte';

    let maximized = false;

    async function maximize() {
        tauriWindow.appWindow.toggleMaximize();
        maximized = !(await tauriWindow.appWindow.isMaximized());
    }

    const destroy = listenSync(TauriEvent.WINDOW_RESIZED, async () => {
        maximized = await tauriWindow.appWindow.isMaximized();
    });
    onDestroy(destroy);
</script>

<Button on:click={maximize}>
    <Tooltip>
        {$t(`titlebar.${maximized ? 'unmaximize' : 'maximize'}`)}
    </Tooltip>
    <i class="ti ti-{maximized ? 'picture-in-picture-top' : 'rectangle'}" />
</Button>
