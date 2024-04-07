<script lang="ts">
    import { client } from '$lib/common/omuchat/client.js';
    import type { App } from '@omuchatjs/omu';
    import { FlexColWrapper, JustifyBaselineWrapper } from '@omuchatjs/ui';

    export let entry: App;
</script>

<div class="entry">
    <FlexColWrapper heightFull>
        <JustifyBaselineWrapper>
            <small>
                {entry.identifier.namespace.split('.').reverse().join('.')}
                <i class="ti ti-slash" />
            </small>
        </JustifyBaselineWrapper>
        <JustifyBaselineWrapper>
            {#if entry.localizations?.name}
                <b>
                    {client.i18n.translate(entry.localizations?.name)}
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
        padding: 10px;
        margin: 10px;
        width: 300px;
        height: 100px;
        border: 1px solid #ccc;
    }
</style>
