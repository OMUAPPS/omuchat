<script lang="ts">
    import { t } from '$lib/i18n/i18n-context.js';
    import { ExternalLink, FlexColWrapper } from '@omuchatjs/ui';
</script>

<FlexColWrapper gap>
    <h2>
        <i class="ti ti-link" />
        {$t('settings.about.links')}
    </h2>
    <ExternalLink href="https://github.com/omuchat/omuchat">
        <h4>
            <i class="ti ti-brand-github" />
            {$t('settings.about.source_code')}
        </h4>
    </ExternalLink>
    <ExternalLink href="https://omuchat.cc">
        <h4>
            <i class="ti ti-world" />
            {$t('settings.about.website')}
        </h4>
    </ExternalLink>
</FlexColWrapper>
