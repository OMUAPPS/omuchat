<script lang="ts">
    import type { App } from '@omujs/omu';
    import { FlexColWrapper, FlexRowWrapper, Localized, Tooltip } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { omu } from '../client.js';
    import { appTable } from './apps.js';
    import { REGISTRIES, type Tag } from './category.js';
    export let app: App;

    function launch() {
        omu.dashboard.openApp(app);
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

    omu.onReady(async () => {
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

<article class:added={alreadyAdded}>
    {#if BROWSER && app.metadata?.image}
        <img src={omu.i18n.translate(app.metadata.image)} alt="" />
    {/if}
    <div class="overlay">
        <FlexRowWrapper baseline widthFull heightFull between>
            <FlexColWrapper heightFull between>
                {#if app.metadata}
                    <FlexRowWrapper alignItems="center" gap>
                        <span class="icon">
                            {#if BROWSER && app.metadata.icon}
                                <i class="ti ti-{omu.i18n.translate(app.metadata.icon)}" />
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
                <button on:click={action} class:active={alreadyAdded}>
                    <i class="ti ti-{alreadyAdded ? 'minus' : 'plus'}" />
                    <Tooltip>
                        {alreadyAdded
                            ? 'アプリをダッシュボードから削除する'
                            : 'アプリをダッシュボードに保存する'}
                    </Tooltip>
                </button>
                <button on:click={launch}>
                    <i class="ti ti-player-play" />
                    <Tooltip>アプリを起動する</Tooltip>
                </button>
            </FlexRowWrapper>
        </FlexRowWrapper>
    </div>
</article>

<style lang="scss">
    article {
        position: relative;
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
        color: var(--color-1);
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-outline);

        &:hover {
            transition: 0.06s;
            margin-left: 3px;
        }
    }

    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .overlay {
        position: relative;
        height: 100%;
    }

    article:hover .overlay {
        outline: 1px solid var(--color-1);
        outline-offset: 2px;
    }

    .icon {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 0.5rem;
        margin-right: 0.25rem;
        font-size: 1.25rem;
        background: var(--color-bg-2);
    }

    p {
        font-weight: bold;
        width: fit-content;
        background: var(--color-bg-2);
    }

    small {
        font-weight: bold;
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 0.7rem;
        background: var(--color-bg-2);
    }

    .tag {
        padding: 0.25rem 0.5rem;
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
        border-bottom: 1px solid var(--color-outline);

        &.active {
            background: var(--color-bg-1);
            color: var(--color-1);
            outline: 1px solid var(--color-1);
            outline-offset: -2px;
        }
    }
</style>
