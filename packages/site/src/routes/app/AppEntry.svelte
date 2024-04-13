<script lang="ts">
    import type { App } from '@omuchatjs/omu';
    import { FlexColWrapper, FlexRowWrapper, Localized, Tooltip } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { client } from '../client.js';
    import { appTable } from './apps.js';
    import { REGISTRIES, type Tag } from './category.js';
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

    let tags: (Tag | string)[] = [];

    $: {
        tags =
            app.metadata?.tags?.map((tag) => {
                const tagData = REGISTRIES[tag];
                if (tagData) {
                    return tagData;
                }
                return tag;
            }) || [];
    }
</script>

<article>
    <FlexRowWrapper baseline widthFull heightFull between>
        <FlexColWrapper heightFull between>
            {#if app.metadata}
                <FlexRowWrapper alignItems="center" gap>
                    <span class="icon">
                        {#if BROWSER && app.metadata.icon}
                            <i class="ti ti-{client.i18n.translate(app.metadata.icon)}" />
                        {:else}
                            <i class="ti ti-app" />
                        {/if}
                    </span>
                    <span>
                        <p>
                            <Localized text={app.metadata.name} />
                        </p>
                        <small>
                            <Localized text={app.metadata.description} />
                        </small>
                    </span>
                </FlexRowWrapper>
            {/if}
            <small>
                {#each tags || [] as tag, i (i)}
                    <span class="tag">
                        {#if typeof tag === 'string'}
                            <i class="ti ti-tag" />
                            {tag}
                        {:else}
                            <i class="ti ti-{tag.icon}" />
                            <Localized text={tag.name} />
                        {/if}
                    </span>
                {/each}
            </small>
        </FlexColWrapper>
        <FlexRowWrapper>
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
        </FlexRowWrapper>
    </FlexRowWrapper>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        height: 100%;
        background: var(--color-bg-1);
        display: flex;
        width: 100%;
        height: 130px;
        padding: 0.5rem;
        background: var(--color-bg-2);
    }

    .icon {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 0.5rem;
        font-size: 1.25rem;
    }

    p {
        font-weight: bold;
    }

    small {
        font-weight: bold;
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 0.7rem;
        color: var(--color-1);
    }

    .tag {
        padding: 0.25rem 0.5rem;
        margin-bottom: 0.5rem;
        background: var(--color-bg-1);

        > i {
            font-size: 0.8rem;
            margin-right: 0.2rem;
        }
    }

    button {
        margin-left: 0.5rem;
        width: 40px;
        height: 40px;
        border: none;
        color: var(--color-bg-1);
        background: var(--color-1);
    }
</style>
