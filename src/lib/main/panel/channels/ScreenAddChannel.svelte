<script lang="ts">
    import { Channel, type Provider } from '@omuchat/client';
    import { onMount } from 'svelte';

    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import Screen from '$lib/common/screen/Screen.svelte';
    
    const { chat } = getClient();
    let providers: Map<string, Provider> | null = null;
    let url: string = '';

    chat.providers!.on({
        onCacheUpdate(cache) {
            providers = cache;
        },
    });
    chat.providers!.fetch(100);

    let matches: Map<string, {
        provider: Provider;
        match: RegExpExecArray;
    }> | null = null;

    function filterProvider(url: string) {
        matches = new Map();
        return [...providers!.entries()].filter(([, provider]) => {
            const regex = new RegExp(provider.regex.replace(/\?P<(\w+)>/g, '?<$1>'));
            if (regex.test(url)) {
                const options = regex.exec(url);
                if (options) {
                    matches!.set(provider.id, {
                        provider: provider,
                        match: options,
                    });
                }
                return true;
            }
            return false;
        });
    }

    let selectedProvider: Provider | null = null;

    function addChannel() {
        if (!selectedProvider)
            return;

        chat.channels!.add(new Channel({
            provider_id: selectedProvider.id,
            active: true,
            created_at: Date.now(),
            url: url,
            description: '',
            id: '',
            icon_url: '',
            name: '',
        }));
        screenContext.pop();
    }

    function onKeyPress(e: KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            if (!selectedProvider) {
                selectedProvider = matches!.get(matches!.keys().next().value)!.provider;
            } else {
                const keys = [...matches!.keys()];
                const index = keys.indexOf(selectedProvider.id);
                if (index === 0) {
                    selectedProvider = matches!.get(keys[keys.length - 1])!.provider;
                } else {
                    selectedProvider = matches!.get(keys[index - 1])!.provider;
                }
            }
        } else if (e.key === 'ArrowDown') {
            if (!selectedProvider) {
                selectedProvider = matches!.get(matches!.keys().next().value)!.provider;
            } else {
                const keys = [...matches!.keys()];
                const index = keys.indexOf(selectedProvider.id);
                if (index === keys.length - 1) {
                    selectedProvider = matches!.get(keys[0])!.provider;
                } else {
                    selectedProvider = matches!.get(keys[index + 1])!.provider;
                }
            }
        } else if (e.key === 'Enter') {
            addChannel();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', onKeyPress);
        return () => {
            window.removeEventListener('keydown', onKeyPress);
        };
    });
</script>

<Screen title="add_channel">
    <div class="container">
        {url}
        <input
            type="text"
            bind:value={url}
        />
        {#if providers && providers.size}
            {#each filterProvider(url) as [provider_id, provider] (provider_id)}
                <button class:active={selectedProvider === provider} on:click={() => {
                    selectedProvider = provider;
                    addChannel();
                }}>
                    {provider.name}
                </button>
            {/each}
        {:else}
            プロバイダーが見つかりませんでした。
        {/if}
    </div>
</Screen>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }

    .active {
        color: #fff;
        background-color: #000;
    }
</style>
