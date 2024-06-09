<script lang="ts">
    import type { App } from '@omujs/omu';
    import { FlexColWrapper, JustifyBaselineWrapper, Localized } from '@omujs/ui';

    export let entry: App;
</script>

<div class="entry">
    <small>
        {entry.id.key()}
    </small>
    <FlexColWrapper heightFull>
        <JustifyBaselineWrapper>
            {#if entry.metadata?.name}
                <b>
                    <Localized text={entry.metadata?.name} />
                </b>
            {/if}
            <small>
                v{entry.version}
            </small>
        </JustifyBaselineWrapper>
    </FlexColWrapper>
</div>

<style>
    .entry {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 300px;
        height: 100px;
        padding: 10px;
        margin: 10px;
        border: 1px solid #ccc;
    }
</style>
