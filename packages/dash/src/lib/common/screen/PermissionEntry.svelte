<script lang="ts">
    import type { PermissionType } from '@omuchatjs/omu/extension/permission/permission.js';
    import { FlexColWrapper, FlexRowWrapper } from '@omuchatjs/ui';
    import { client } from '../omuchat/client.js';

    export let permission: PermissionType;
</script>

<div>
    <FlexColWrapper widthFull>
        <FlexRowWrapper widthFull between>
            <i class="ti ti-eye" />
            {permission.id.key()}
        </FlexRowWrapper>
        <FlexRowWrapper widthFull between>
            {client.i18n.translate(permission.metadata.name)}
            <small>
                {client.i18n.translate(permission.metadata.note)}
            </small>
        </FlexRowWrapper>
    </FlexColWrapper>
</div>

<style>
    div {
        width: 100%;
        padding: 10px;
    }
</style>
