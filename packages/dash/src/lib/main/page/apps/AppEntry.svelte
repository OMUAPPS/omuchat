<script lang="ts">
    import { openApp } from './index.js';

    import type { ChatApp } from '$lib/common/omuchat/chatapp.js';
    import { t } from '$lib/i18n/i18n-context.js';

    export let entry: ChatApp;
</script>

<button class="app" on:click={() => openApp(entry)}>
    <div class="app-header">
        <div class="icon">
            {#if entry.icon?.startsWith('ti')}
                <i class={entry.icon} />
            {:else}
                <img src={entry.icon ?? '/img/user.png'} alt="" width="18" height="18" />
            {/if}
        </div>
        <div class="name">
            {$t(`apps.${entry.id}.name`)}
        </div>
        <span>
            {$t('panels.apps.open_apps')}
            <i class="ti ti-external-link" />
        </span>
    </div>
    <div class="app-body">
        <button> </button>
    </div>
</button>

<style lang="scss">
    .app-header {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        width: 100%;
        height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);

        span {
            display: none;
            margin-left: auto;
            font-size: 12px;
        }
    }

    .icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: var(--color-1);
    }

    .name {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
    }

    .app-body {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        width: 100%;
        height: 130px;
        padding: 20px;
        overflow: hidden;
        cursor: pointer;
        background: var(--color-bg-2);
    }

    .thumbnail {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .app {
        position: relative;
        width: 100%;
        padding: 10px;
        background: none;
        border: none;

        &:hover {
            .app-body {
                outline: 2px solid var(--color-1);
                transition: 0.02s;
            }

            .app-header {
                span {
                    display: block;
                }
            }
        }
    }
</style>
