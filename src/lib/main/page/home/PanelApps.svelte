<script lang="ts">
    import AppEntry from "./AppEntry.svelte";
    import omuhub from "./omuhub.svg";

    import { getClient } from "$lib/common/omuchat/client.js";
    import TableList from "$lib/common/omuchat/TableList.svelte";
    import Tooltip from "$lib/common/tooltip/Tooltip.svelte";

    const { dashboard } = getClient();
</script>

<div class="container">
    <TableList
        table={dashboard.apps}
        component={AppEntry}
        fitHeight={true}
    />
    <a href="https://omuchat.github.io/apps" target="_blank">
        <img src={omuhub} alt="omuchat hub" height="12" />
        <Tooltip>
            OMUCHAT HUB
        </Tooltip>
        でアプリを探す
        <i class="ti ti-external-link" />
    </a>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        overflow-y: auto;
        background: var(--color-bg-1);
    }

    a {
        width: fit-content;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;

        &:hover {
            border-bottom: 1px solid var(--color-1);
        }
    }
</style>
