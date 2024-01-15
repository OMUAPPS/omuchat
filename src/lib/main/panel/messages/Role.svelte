<script lang="ts">
    import type { models } from '@omuchatjs/chat';

    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { applyOpacity, style } from '$lib/utils/class-helper.js';

    export let role: models.Role;
</script>

<div class="role" style={style(role.color ? {
    color: role.color,
    background: applyOpacity(role.color, 0.1),
} : {})}>
    {#if role.icon_url}
        <img class="img" src={role.icon_url} alt="role icon" />
    {:else}
        {role.name}
    {/if}
    <Tooltip>
        <div class="tooltip">
            <span class="preview">
                {role.name}
                {#if role.icon_url}
                <img src={role.icon_url} alt="role icon" />
                {/if}
            </span>
            <small>
                <span>
                    Color:
                </span>
                {role.color}
            </small>
            {#if role.is_moderator}
            <small>
                Moderator
            </small>
            {/if}
            {#if role.is_owner}
            <small>
                Owner
            </small>
            {/if}
        </div>
    </Tooltip>
</div>

<style>
    .role {
        display: flex;
        flex-direction: row;
        gap: 1px;
        height: calc(1.4rem);
        padding: 4px;
        font-size: 0.8rem;
        font-weight: bold;
        line-height: 1rem;
        color: var(--color-1);
        white-space: nowrap;
        background: color-mix(in srgb, var(--color-1) 10%, transparent 0%);
    }

    .img {
        height: 100%;
        object-fit: contain;
        vertical-align: middle;
    }

    .preview {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        
        & > img {
            height: 42px;
            padding: 2px;
            object-fit: contain;
        }
    }

    .tooltip {
        display: flex;
        flex-direction: column;
        padding: 2px;
    }

    small {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        padding: 2px;
        font-size: 0.6rem;
        font-weight: normal;
        color: var(--color-2);

    }
</style>