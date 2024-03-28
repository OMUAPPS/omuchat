<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { version } from '$lib/version.json';
    import { FlexColWrapper } from '@omuchatjs/ui';
    import { DEV } from 'esm-env';
</script>

<FlexColWrapper gap>
    <h2>
        <i class="ti ti-letter-v" />
        {$t('settings.about.version')}
    </h2>
    {version}{DEV ? ' (dev)' : ''}
</FlexColWrapper>
