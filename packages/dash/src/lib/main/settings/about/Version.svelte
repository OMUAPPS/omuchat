<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { FlexColWrapper } from '@omuchatjs/ui';
</script>

<FlexColWrapper gap>
    <h2>
        <i class="ti ti-letter-v" />
        {$t('settings.about.version')}
    </h2>
    開発中のバージョンです。
</FlexColWrapper>
