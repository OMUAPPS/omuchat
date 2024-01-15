<script lang="ts">
    import type { App } from "@omuchatjs/omu";

    export let entry: App;
</script>

<div class="entry">
    <div class="name">
        name:
        {entry.name}
    </div>
    <div class="group">
        group:
        {entry.group}
    </div>
    <div class="authors">
        authors:
        {entry.authors}
    </div>
    <div class="version">
        version:
        {entry.version}
    </div>
    {entry.key()}
</div>

<style>
    .entry {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        margin: 10px;
        border: 1px solid #ccc;
    }

    .name {
        font-weight: bold;
    }
</style>