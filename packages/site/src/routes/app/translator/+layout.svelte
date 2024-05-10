<script lang="ts">
    import { AppHeader, FlexRowWrapper, Toggle } from '@omuchatjs/ui';
    import { client, config } from './client.js';

    const promise = new Promise<void>((resolve) => {
        client.event.ready.subscribe(() => {
            resolve();
        });
    });
    function toggle() {
        $config = {
            ...$config,
            active: !$config.active,
        };
    }
</script>

{#await promise}
    <AppHeader app={client.app} />
{:then}
    <AppHeader app={client.app}>
        <FlexRowWrapper alignItems="center" gap>
            <small>オン/オフ</small>
            <Toggle value={$config.active} handleToggle={toggle} />
        </FlexRowWrapper>
    </AppHeader>
    <slot />
{/await}
