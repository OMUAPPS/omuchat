<script lang="ts">
    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import { t } from '$lib/i18n/i18n-context.js';
</script>

<FlexColWrapper gap>
    <h2>
        <i class="ti ti-letter-v" />
        {$t('settings.about.version')}
    </h2>
    開発中のバージョンです。
</FlexColWrapper>
