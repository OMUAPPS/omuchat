<script lang="ts">
    import type { PermissionRequest } from '@omuchatjs/omu/extension/dashboard/dashboard.js';
    import { FlexColWrapper, FlexRowWrapper, JustifyBaselineWrapper } from '@omuchatjs/ui';
    import PermissionEntry from './PermissionEntry.svelte';
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

<Screen {screen} title="permission_request" disableClose>
    <FlexColWrapper heightFull between widthFull>
        <span class="text">
            <FlexRowWrapper>
                <FlexColWrapper>
                    <JustifyBaselineWrapper>
                        <small>
                            {props.request.app.group.split('.').reverse().join('.')}
                            <i class="ti ti-slash" />
                        </small>
                        <b>
                            {props.request.app.name}
                        </b>
                        <small>
                            v{props.request.app.version}
                        </small>
                    </JustifyBaselineWrapper>
                </FlexColWrapper>
            </FlexRowWrapper>
            は以下の権限を要求しています。
        </span>
        <FlexRowWrapper widthFull justifyContent="center">
            {#each props.request.permissions as permission}
                <PermissionEntry {permission} />
            {/each}
        </FlexRowWrapper>
        <FlexRowWrapper widthFull between baseline>
            <button on:click={reject} class="reject">
                拒否
                <i class="ti ti-x" />
            </button>
            <button on:click={accept} class="accept">
                許可
                <i class="ti ti-check" />
            </button>
        </FlexRowWrapper>
    </FlexColWrapper>
</Screen>

<style lang="scss">
    button {
        padding: 8px 14px;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        outline: none;
        outline-offset: -1px;
        margin-right: 1px;
    }

    .identifier {
        opacity: 0.6;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px 20px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
    }

    .accept {
        background: var(--color-1);
        color: var(--color-bg-2);

        &:hover {
            outline: 1px solid var(--color-bg-2);
        }
    }

    .reject {
        margin-left: auto;
        outline: 1px solid var(--color-1);

        &:hover {
            outline-offset: -2px;
        }
    }
</style>
