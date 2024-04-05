<script lang="ts">
    import { screenContext, type ScreenComponent, type ScreenHandle } from './screen.js';

    let current: {
        screen: ScreenComponent<unknown>;
        handle: ScreenHandle;
        props: unknown;
    } | null = null;

    screenContext.current.subscribe((screen) => {
        if (!screen) {
            current = null;
            return;
        }
        current = {
            screen,
            handle: {
                id: screen.id,
                pop() {
                    screenContext.pop(screen.id);
                },
            },
            props: screen.props,
        };
    });
</script>

{#if current}
    <svelte:component this={current.screen.component} screen={current} />
{/if}
