<script lang="ts">
    import type { models } from '@omuchat/client';

    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { applyOpacity, style } from '$lib/util/class-helper';

    export let role: models.Role;
</script>

<div class="role" style={style(role.color ? {
    color: role.color,
    background: applyOpacity(role.color, 0.1),
} : {})}>
    {role.name}
    {#if role.icon_url}
        <img class="img" src={role.icon_url} alt="role icon" />
    {/if}
    <Tooltip>
        {role.id}
    </Tooltip>
</div>

<style>
    .role {
        display: flex;
        flex-direction: row;
        gap: 1px;
        align-items: center;
        height: calc(1rem + 4px);
        padding: 2px 4px;
        margin-left: 5px;
        font-size: 0.8rem;
        font-weight: 500;
        line-height: 1rem;
        white-space: nowrap;
    }

    .img {
        height: 90%;
        object-fit: contain;
        margin-left: 2px;
        vertical-align: middle;
    }
</style>