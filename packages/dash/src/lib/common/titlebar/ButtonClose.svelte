<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { tauriWindow } from '$lib/utils/tauri.js';
    import { Button, Tooltip } from '@omuchatjs/ui';

    function close() {
        tauriWindow.appWindow.close();
    }
</script>

<Button on:click={close}>
    <Tooltip>{$t('titlebar.close')}</Tooltip>
    <i class="ti ti-x" />
</Button>
