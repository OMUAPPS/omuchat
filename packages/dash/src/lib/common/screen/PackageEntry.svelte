<script lang="ts">
    import type { PackageInfo } from '@omuchatjs/omu/extension/plugin/package-info.js';
    import { FlexColWrapper, FlexRowWrapper, Tooltip } from '@omuchatjs/ui';

    export let entry: PackageInfo;
</script>

<div>
    <Tooltip>
        {entry.info.summary}
    </Tooltip>
    <FlexColWrapper widthFull>
        <FlexRowWrapper widthFull between>
            <span>
                <i class="ti ti-package" />
                {entry.info.name}
            </span>
            <small>
                {entry.info.name}
            </small>
        </FlexRowWrapper>
        <FlexRowWrapper widthFull between>
            <small>
                <a href={entry.info.package_url}>
                    {entry.info.package_url}
                    <i class="ti ti-external-link" />
                </a>
            </small>
        </FlexRowWrapper>
    </FlexColWrapper>
</div>

<style>
    div {
        width: 90%;
        padding: 5px 10px;
        margin: 4px 10px;
        color: var(--color-1);
        font-weight: 600;
        border: 1px solid var(--color-outline);
        background: var(--color-bg-1);
    }
</style>
