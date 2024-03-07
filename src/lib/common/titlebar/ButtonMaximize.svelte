<script lang="ts">
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context.js';
    import { tauriWindow } from '$lib/utils/tauri.js';

    let maximized = false;

    async function maximize() {
        tauriWindow.appWindow.toggleMaximize();
        maximized = !(await tauriWindow.appWindow.isMaximized());
    }
</script>

<Button on:click={maximize}>
    <Tooltip>
        {$t(`titlebar.${maximized ? 'unmaximize' : 'maximize'}`)}
    </Tooltip>
    <i class="ti ti-{maximized ? 'picture-in-picture-top' : 'rectangle'}" />
</Button>
