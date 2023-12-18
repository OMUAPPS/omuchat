<script lang="ts">
    import type { WindowOptions } from "@tauri-apps/api/window";

    import { apps, windows, type App } from "$lib/apps/apps";
    import { t } from "$lib/i18n/i18n-context";
    import { openWindow } from "$lib/utils/tauri";
        
    function openApp(app: App) {
        const windowId = `app-${app.id}`;
        console.log(app);
        let options: WindowOptions = {
            url: `/app?id=${app.id}`,
            title: $t(`apps.${app.id}.name`),
            width: 800,
            height: 600,
            resizable: true,
            maximizable: true,
            transparent: false,
            decorations: true,
            alwaysOnTop: false,
        };
        if (app.options) options = Object.assign(options, app.options);
        const window = openWindow(windowId, options);
        windows.set(windowId, window);
        window.setFocus();
    }
</script>


<div class="container">
    <div class="header">
        <div class="title">
            <i class="ti ti-player-play" />
            アプリ
        </div>
        <div>
        </div>
    </div>
    <div class="apps">
        {#each apps.entries() as [key, app] (key)}
            <button class="app" on:click={() => openApp(app)}>
                <div class="app-header">
                    <div class="icon">
                        {#if app.icon.startsWith('ti')}
                            <i class={app.icon} />
                        {:else}
                            <img src={app.icon} alt="" width="18" height="18" />
                        {/if}
                    </div>
                    <div class="name">
                        {$t(`apps.${app.id}.name`)}
                    </div>
                    <span>
                        アプリを開く
                        <i class="ti ti-external-link" />
                    </span>
                </div>
                <div class="app-body">
                    <img class="thumbnail" src="https://picsum.photos/seed/{Date.now()}{app.id}/300/160" alt="" width="300" height="160" />
                </div>
            </button>
        {/each}
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: calc(100% - 81px);
        margin-top: 81px;
        overflow-y: scroll;
        background: var(--color-bg-1);

        .header {
            position: fixed;
            top: 40px;
            left: 40px;
            display: flex;
            flex-direction: row;
            gap: 40px;
            align-items: center;
            width: 100%;
            height: 80px;
            padding: 40px;
            color: var(--color-1);
            background: var(--color-bg-2);
            border-bottom: 1px solid var(--color-1);

            .title {
                display: flex;
                flex-direction: row;
                gap: 10px;
                align-items: baseline;
                font-size: 18px;
                font-weight: 600;
                color: var(--color-1);
            }
        }
    }

    .apps {
        display: flex;
        flex-flow: row wrap;
        gap: 40px;
        width: fit-content;
        padding: 40px;
    }

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
        width: 300px;
        height: 160px;
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
        background: none;
        border: none;

        &:hover {
            .app-body {
                outline: 2px solid var(--color-1);
                box-shadow: 0 8px 0 2px var(--color-2);
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
