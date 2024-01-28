<script lang="ts">
    import type { ChatApp } from "$lib/common/omuchat/chatapp.js";
    
export let entry: ChatApp;
</script>

<a href={entry.url} target="_blank">
    <div class="entry">
        <div class="left">
            <div class="app-icon">
                {#if entry.icon?.startsWith("http")}
                    <img src={entry.icon} alt="icon" />
                {:else}
                    <i class="ti ti-{entry.icon ?? `box`}" />
                {/if}
            </div>
            <div class="description">
                <div class="app-name">{entry.name}</div>
                <small class="app-url">
                    {entry.description}
                </small>
            </div>
        </div>
        <div class="right">
            起動する
            <i class="ti ti-arrow-right" />
        </div>
    </div>
</a>

<style lang="scss">
    .entry {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: fit-content;
        padding: 10px 15px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline-offset: -5px;
    }

    .left {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }

    .right {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-end;
        margin-right: 10px;
        visibility: hidden;
    }

    .entry:hover {
        background: var(--color-bg-1);
        outline: 1px solid var(--color-1);
        outline-offset: -3px;
        transition: 0.06s;

        .right {
            margin-right: 5px;
            visibility: visible;
            transition: 0.06s;
        }
    }

    .app-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
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

    .description {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .app-name {
            font-size: 16px;
            font-weight: 700;
        }
        .app-url {
            font-size: 12px;
            font-weight: 400;
        }
    }

    a {
        text-decoration: none;
    }
</style>