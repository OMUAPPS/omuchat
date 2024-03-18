<script lang="ts">
    import ExternalLink from '$lib/common/input/ExternalLink.svelte';
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
        type: string;
        site_admin: boolean;
        contributions: number;
    }

    const initialURL = 'https://api.github.com/repos/OMUCHAT/dashboard/contributors';
    let contributors: Contributor[] = [];

    onMount(async () => {
        const res = await fetch(initialURL);
        contributors = await res.json();
        contributors = contributors.filter((contributor) => contributor.type == 'User');
    });
</script>

<div class="container">
    {#each contributors as contributor, index}
        <ExternalLink href={contributor.html_url}>
            <div class="license">
                <div class="body">
                    <img class="icon" src={contributor.avatar_url} alt={contributor.login} /><br />
                    <h3>
                        {contributor.login}
                    </h3>
                </div>
            </div>
        </ExternalLink>
    {/each}
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding-top: 40px;
        padding-left: 50%;
        overflow: auto;
        text-align: center;
    }

    .license {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 20px 0;
        text-align: center;
        cursor: pointer;
        background: none;
        border: none;

        .icon {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px var(--color-text) solid;
            transition: all 0.3s ease 0s;
        }

        .body {
            padding-left: 10px;
            h3 {
                font-size: 20px;
                color: var(--color-text);
            }
        }

        &:hover {
            .icon {
                transform: scale(1.1);
                transition: all 0.3s ease 0s;
            }
        }
    }
</style>
