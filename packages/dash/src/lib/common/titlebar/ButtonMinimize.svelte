<script lang="ts">
    import Button from '../input/Button.svelte';

    import { t } from '$lib/i18n/i18n-context.js';
    import { tauriWindow } from '$lib/utils/tauri.js';
    import { Tooltip } from '@omuchatjs/ui';

    function minimize() {
        tauriWindow.appWindow.minimize();
    }
</script>

<Button on:click={minimize}>
    <Tooltip>{$t('titlebar.minimize')}</Tooltip>
    <i class="ti ti-minus" />
</Button>
