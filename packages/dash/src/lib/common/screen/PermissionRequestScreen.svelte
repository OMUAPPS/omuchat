<script lang="ts">
    import type { PermissionRequest } from '@omuchatjs/omu/extension/dashboard/dashboard.js';
    import Screen from './Screen.svelte';
    import type { ScreenHandle } from './screen.js';

    export let screen: ScreenHandle;
    export let props: {
        request: PermissionRequest;
        resolve: (accept: boolean) => void;
    };

    function accept() {
        props.resolve(true);
        screen.pop();
    }

    function reject() {
        props.resolve(false);
        screen.pop();
    }
</script>

<Screen {screen} title="permission_request">
    aaa
    {props.request.app.identifier.key()}
    <button on:click={accept}>許可</button>
    <button on:click={reject}>拒否</button>
</Screen>
