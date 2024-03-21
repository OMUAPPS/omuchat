<script lang="ts">
    import type { models } from '@omuchatjs/chat';

    import { getClient } from '$lib/common/omuchat/client.js';
    import { applyOpacity, style } from '$lib/utils/class-helper.js';
    import { Tooltip } from '@omuchatjs/ui';

    const { client } = getClient();

    export let role: models.Role;
</script>

<div
    class="role"
    style={style(
        role.color
            ? {
                  color: role.color,
                  background: applyOpacity(role.color, 0.1),
              }
            : {},
    )}
>
    {#if role.iconUrl}
        <img class="img" src={role.iconUrl} alt="role icon" />
    {:else}
        {#if role.isOwner}
            <i class="ti ti-crown" />
        {:else if role.isModerator}
            <i class="ti ti-shield" />
        {/if}
        {role.name}
    {/if}
    <Tooltip>
        <div class="tooltip">
            <span class="preview">
                {role.name}
                {#if role.iconUrl}
                    <img src={client.assets.proxy(role.iconUrl)} alt="role icon" />
                {/if}
            </span>
            <small>
                <span> Color: </span>
                {role.color}
            </small>
            {#if role.isModerator}
                <small> Moderator </small>
            {/if}
            {#if role.isOwner}
                <small> Owner </small>
            {/if}
        </div>
    </Tooltip>
</div>

<style>
    .role {
        display: flex;
        flex-direction: row;
        gap: 2px;
        align-items: center;
        width: fit-content;
        height: calc(1.4rem);
        padding: 4px;
        font-size: 0.8rem;
        font-weight: bold;
        line-height: 1rem;
        color: var(--color-1);
        white-space: nowrap;
    }

    .img {
        height: 100%;
        vertical-align: middle;
        object-fit: contain;
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
