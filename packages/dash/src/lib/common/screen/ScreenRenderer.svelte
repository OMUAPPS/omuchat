<script lang="ts">
    import { screenContext, type ScreenComponent, type ScreenHandle } from './screen.js';

    let current: {
        screen: ScreenComponent<unknown>;
        handle: ScreenHandle;
    } | null = null;

    screenContext.current.subscribe((newValue) => {
        if (!newValue) {
            current = null;
            return;
        }
        const screen = newValue!;
        current = {
            screen,
            handle: {
                id: screen.id,
                pop() {
                    screenContext.pop(newValue.id);
                },
            },
        };
    });
</script>

{#if current}
    <svelte:component
        this={current.screen.component}
        screen={current.handle}
        props={current.screen.props}
    />
{/if}
