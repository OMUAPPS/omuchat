<script lang="ts">
    import type { AppMetadata } from '$lib/common/omuchat/app-metadata.js';
    import { tauriWindow } from '$lib/utils/tauri.js';
    import { FlexColWrapper, FlexRowWrapper } from '@omuchatjs/ui';

    import { t } from '$lib/i18n/i18n-context.js';

    export let entry: AppMetadata;
    export let selected: boolean = false;

    function openApp() {
        const safeAppLabel =
            entry.identifier.namespace.replace(/\./g, '-') +
            btoa(entry.identifier.key()).replace(/=/g, '');
        console.log('openApp', safeAppLabel);
        const window = new tauriWindow.WebviewWindow(safeAppLabel, {
            url: entry.url,
            title: entry.name,
        });
        window.setFocus();
    }
</script>

<button on:click={openApp} class:selected>
    <FlexRowWrapper widthFull between>
        <FlexRowWrapper>
            <div class="icon">
                {#if entry.icon?.startsWith('http')}
                    <img src={entry.icon} alt="icon" />
                {:else}
                    <i class="ti ti-{entry.icon ?? `box`}" />
                {/if}
            </div>
            <FlexColWrapper>
                <div class="name">{entry.name}</div>
                <small>
                    {entry.identifier.namespace.split('.').reverse().join('.')}
                </small>
            </FlexColWrapper>
        </FlexRowWrapper>
        <div class="right">
            {$t('panels.apps.start_apps')}
            <i class="ti ti-chevron-right" />
        </div>
    </FlexRowWrapper>
</button>

<style lang="scss">
    button {
        position: relative;
        width: 100%;
        height: fit-content;
        padding: 15px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        outline: none;
        outline-offset: -5px;
    }

    .right {
        position: absolute;
        top: 5px;
        right: 5px;
        bottom: 5px;
        display: flex;
        gap: 5px;
        align-items: baseline;
        justify-content: center;
        padding-right: 20px;
        padding-top: 20px;
        text-wrap: nowrap;
        visibility: hidden;
        background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--color-bg-1) 50%, transparent 0%),
            var(--color-bg-1)
        );
    }

    .selected {
        background: var(--color-bg-1);
        outline: 1px solid var(--color-1);
        transition: 0.06s;

        .right {
            padding-right: 15px;
            visibility: visible;
            transition: 0.06s;
        }
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        i {
            font-size: 22px;
        }
    }

    .name {
        font-size: 16px;
        font-weight: 700;
    }

    small {
        font-size: 12px;
        font-weight: 400;
    }
</style>
