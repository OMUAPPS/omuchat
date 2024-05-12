<script lang="ts">
    import type { PermissionType } from '@omuchatjs/omu/extension/permission/permission.js';
    import { FlexColWrapper, FlexRowWrapper } from '@omuchatjs/ui';
    import { client } from '../omuchat/client.js';

    export let permission: PermissionType;
</script>

<div>
    <FlexColWrapper widthFull>
        <FlexRowWrapper widthFull between>
            <span>
                <i class="ti ti-eye" />
                {client.i18n.translate(permission.metadata.name)}
            </span>
            <small>
                {permission.id.key()}
            </small>
        </FlexRowWrapper>
        <FlexRowWrapper widthFull between>
            <small>
                {client.i18n.translate(permission.metadata.note)}
            </small>
        </FlexRowWrapper>
    </FlexColWrapper>
</div>

<style>
    div {
        width: 90%;
        padding: 5px 10px;
        margin: 4px 10px;
        font-weight: 600;
        color: var(--color-1);
        background: var(--color-bg-1);
        border: 1px solid var(--color-outline);
    }
</style>
