<script lang="ts">
    import { Popup, Tooltip } from '@omujs/ui';
    import type { User } from '../marshmallow-app.js';
    import Account from './Account.svelte';

    export let users: Record<string, User> | null;
    export let user: User | null = null;
</script>

<button class="switcher" class:switch={users && Object.keys(users).length > 1}>
    {#if user}
        <Account {user} />
    {/if}
    {#if users && Object.keys(users).length > 1}
        <Tooltip>
            {#if user}
                <b>{user.screen_name}</b> <small>にログインしています</small>
            {:else}
                ログインしていません
            {/if}
            <br />
            アカウントを切り替える
        </Tooltip>
        <Popup noBackground>
            {#if users}
                <div class="users">
                    {#each Object.entries(users) as [id, entry]}
                        <button on:click={() => (user = entry)} class="user">
                            <img src={entry.image} alt={entry.name} />
                            <span class="user-info">
                                <p>{entry.screen_name}</p>
                                <small>{entry.name}</small>
                            </span>
                        </button>
                    {/each}
                </div>
            {/if}
        </Popup>
        <i class="ti ti-chevron-down" />
    {:else}
        <Tooltip>
            {#if user}
                <b>{user.screen_name}</b> <small>にログインしています</small>
            {:else}
                ログインしていません
            {/if}
        </Tooltip>
    {/if}
</button>

<style lang="scss">
    .switcher {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        border-bottom: 1px solid var(--color-outline);

        > :global(*) {
        }

        > i {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: 1.25rem;
            width: 2rem;
            height: 2rem;
        }

        &.switch {
            &:focus,
            &:hover {
                background: var(--color-bg-1);
                color: var(--color-1);
                padding-left: 0.25rem;
                transition-duration: 0.0621s;
                transition-property: padding-left, background, color;
            }
        }
    }

    .user {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        width: 100%;
        background: var(--color-bg-2);
        border: none;
        cursor: pointer;

        > img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
        }

        > .user-info {
            align-items: start;
        }

        &:focus,
        &:hover {
            background: var(--color-bg-1);
        }
    }
</style>
