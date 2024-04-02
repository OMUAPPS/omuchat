<script lang="ts">
    import type { PermissionType } from '@omuchatjs/omu/extension/permission/permission.js';

    export let permission: PermissionType;
</script>

<div class="permission-entry">
    <span class="text">
        <i class="ti ti-eye" />
        {permission.identifier.key()}
    </span>
</div>
