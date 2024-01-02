<script lang="ts">
    import type { Asset } from '$lib/common/omuchat/asset';
    import { t } from '$lib/i18n/i18n-context';
    import { DragHelper } from '$lib/utils/drag-helper';
    import { invoke } from '$lib/utils/tauri';

    export let entry: Asset;
    let preview: HTMLDivElement;

    async function handleDragStart(event: DragEvent) {
        DragHelper.setDragImage(event, preview);
        let url = entry.url;

        let host = window.location.origin;
        if (typeof window.__TAURI_IPC__ == 'undefined') {
            const res = await invoke('share_url');
            host = `${res.host}:${res.port}`;
        }
        if (!url.startsWith('http')) url = `${host}${url}`;
        DragHelper.setUrl(event, url);
    }
</script>

<div class="container" on:dragstart={handleDragStart} draggable="true" role="form">
    <div class="header">
        <i class={$t(`assets.${entry.id}.icon`)} />
        <class class="asset-name">{$t(`assets.${entry.id}.name`)}</class>
    </div>
    <div class="asset">
        <img src={entry.thumbnail} alt="" />
        <div class="info">
            <div class="description">
                {$t(`assets.${entry.id}.description`)}
            </div>
            <div class="tags">
                {entry.tags.join(', ')}
            </div>
            <div class="drag-hint">
                <i class="ti ti-drag-drop" />
                ドラッグアンドドロップして追加できます
            </div>
        </div>
    </div>
    <div class="preview" bind:this={preview}>
        <img src={entry.thumbnail} alt="" />
        <div>
            <i class="ti ti-package" />
            {entry.name}
        </div>
    </div>
</div>

<style lang="scss">
    .preview {
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-100%, -100%);

        img {
            width: 250px;
            height: 140px;
        }

        div {
            position: absolute;
            top: 0;
            right: 0;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            line-height: 0;
            color: var(--color-1);
            background: var(--color-bg-2);
        }
    }

    .header {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: baseline;
        padding: 10px;
        padding-left: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 0;
        color: var(--color-1);

        i {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: var(--color-1);
        }
    }

    .asset {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        height: 130px;
        overflow: hidden;
        font-size: 18px;
        font-style: normal;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);

        img {
            top: 0;
            left: 0;
            width: 240px;
            min-width: 240px;
            height: 100%;
            object-fit: cover;
        }

        .info {
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            padding: 10px;

            .tags {
                font-size: 12px;
                color: var(--color-1);
            }

            .description {
                font-size: 14px;
                font-weight: 600;
                color: var(--color-1);
            }
        }

        .drag-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: var(--color-1);
            white-space: nowrap;
            visibility: hidden;

            i {
                font-size: 24px;
            }
        }
    }

    .container {
        display: flex;
        flex-direction: column;
        padding: 10px;

        &:hover {
            .asset {
                margin-left: -5px;
                outline: 2px solid var(--color-1);
                box-shadow: 5px 5px 0 2px var(--color-2);
                transition: 0.1s;

                img {
                    opacity: 0.2;
                }

                .drag-hint {
                    visibility: visible;
                }
            }
        }
    }
</style>
