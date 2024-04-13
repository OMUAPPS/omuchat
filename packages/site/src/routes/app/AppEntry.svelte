<script lang="ts">
    import type { App } from '@omuchatjs/omu';
    import { Localized, Tooltip } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { client } from '../client.js';
    import { appTable } from './apps.js';
    import { TAG_REGISTRY } from './category.js';
    export let app: App;

    function launch() {
        client.dashboard.openApp(app);
    }

    let alreadyAdded = false;

    async function action() {
        const old = await appTable.get(app.key());
        console.log(old);
        if (old) {
            appTable.remove(app);
            alreadyAdded = false;
        } else {
            appTable.add(app);
            alreadyAdded = true;
        }
    }

    client.network.addTask(async () => {
        alreadyAdded = !!(await appTable.get(app.key()));
    });
</script>

<article>
    <h2>
        {#if app.metadata}
            {#if BROWSER && app.metadata.icon}
                <i class="ti ti-{client.i18n.translate(app.metadata.icon)}" />
            {:else}
                <i class="ti ti-app" />
            {/if}
            <p>
                <Localized text={app.metadata.name} />
            </p>
            <p>
                <Localized text={app.metadata.description} />
            </p>
        {/if}
    </h2>
    <span>
        <button on:click={action}>
            <i class="ti ti-{alreadyAdded ? 'check' : 'plus'}" />
            <Tooltip>
                <p>アプリをダッシュボードに保存する</p>
            </Tooltip>
        </button>
        <button on:click={launch}>
            <i class="ti ti-player-play" />
            <Tooltip>
                <p>アプリを起動する</p>
            </Tooltip>
        </button>
    </span>
    <small>
        {#each app.metadata?.tags || [] as tag (tag)}
            {@const tagData = TAG_REGISTRY[tag]}
            <span>
                {#if tagData}
                    <i class="ti ti-{tagData.icon}" />
                    <Localized text={tagData.name} />
                {:else}
                    {tag}
                {/if}
            </span>
        {/each}
    </small>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100%;
        background: var(--color-bg-1);
        display: flex;
        width: 100%;
        height: 140px;
        padding: 1rem;
        background: var(--color-bg-2);
    }

    h2 {
        font-weight: bold;
    }
</style>
