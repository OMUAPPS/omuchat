<script lang="ts">
    import { AppHeader, FlexRowWrapper, Toggle } from '@omuchatjs/ui';
    import { omu, config } from './client.js';

    const promise = new Promise<void>((resolve) => omu.whenReady(resolve));
    function toggle() {
        $config = {
            ...$config,
            active: !$config.active,
        };
    }
</script>

{#await promise}
    <AppHeader app={omu.app} />
{:then}
    <AppHeader app={omu.app}>
        <FlexRowWrapper alignItems="center" gap>
            <small>オン/オフ</small>
            <Toggle value={$config.active} handleToggle={toggle} />
        </FlexRowWrapper>
    </AppHeader>
    <slot />
{/await}
