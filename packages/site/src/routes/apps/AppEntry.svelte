<script lang="ts">
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { client } from '../client.js';
    import type { AppMetadata } from './app-metadata.js';
    import { appsTable } from './apps.js';
    export let app: AppMetadata;

    function launch() {
        window.location.href = app.url;
    }

    let alreadyAdded = false;

    async function action() {
        const old = await appsTable.get(app.key());
        console.log(old);
        if (old) {
            appsTable.remove(app);
            alreadyAdded = false;
        } else {
            appsTable.add(app);
            alreadyAdded = true;
        }
    }

    client.network.addTask(async () => {
        alreadyAdded = !!(await appsTable.get(app.key()));
    });
</script>

<article>
    <div class="header">
        <h2>
            <i class="ti ti-{app.icon}" />
            {app.name}
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
    </div>
    <div class="body">
        <p>...</p>
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100%;
        background: var(--color-bg-1);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            background: var(--color-bg-2);
            border: none;
            border-radius: 5px;

            &:hover {
                background: var(--color-bg-3);
            }
        }
    }

    h2 {
        font-weight: bold;
    }

    .body {
        display: flex;
        width: 100%;
        height: 10rem;
        padding: 1rem;
        background: var(--color-bg-2);
    }
</style>
