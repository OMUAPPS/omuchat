<script lang="ts">
    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import ExternalLink from '$lib/common/input/ExternalLink.svelte';
    import { t } from '$lib/i18n/i18n-context.js';
    import { onMount } from 'svelte';

    interface Contributor {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: 'User' | 'Organization' | 'Bot';
        site_admin: boolean;
        contributions: number;
    }

    const contributorsUrl = 'https://api.github.com/repos/OMUCHAT/dashboard/contributors';
    let contributors: Contributor[] = [];

    onMount(async () => {
        const res = await fetch(contributorsUrl);
        contributors = await res.json();
        contributors = contributors
            .filter((contributor) => contributor.type !== 'Bot')
            .sort((a, b) => b.contributions - a.contributions);
    });
</script>

<FlexColWrapper widthFull gap>
    <h2>
        <i class="ti ti-code" />
        {$t('settings.about.contributors')}
    </h2>
    {#each contributors as contributor}
        <ExternalLink href={contributor.html_url}>
            <h4>
                {contributor.login}
                <i class="ti ti-external-link" />
            </h4>
        </ExternalLink>
    {/each}
</FlexColWrapper>

<style lang="scss">
    h4 {
        margin: 0;
        width: 100%;

        &:hover {
            border-left: 2px solid var(--color-1);
            padding-left: 10px;
        }
    }
</style>
