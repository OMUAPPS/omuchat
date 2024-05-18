<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { tauriWindow } from '$lib/utils/tauri.js';
    import { Button, Tooltip } from '@omujs/ui';

    function minimize() {
        tauriWindow.appWindow.minimize();
    }
</script>

<Button on:click={minimize}>
    <Tooltip>{$t('titlebar.minimize')}</Tooltip>
    <i class="ti ti-minus" />
</Button>
