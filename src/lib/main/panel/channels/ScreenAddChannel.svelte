<script lang="ts">
    import { models } from '@omuchat/client';
    import { onMount } from 'svelte';

    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import Screen from '$lib/common/screen/Screen.svelte';

    const { chat } = getClient();
    let providers: Map<string, models.Provider> | undefined;
    let url: string = '';

    chat.providers!.addListener({
        onCacheUpdate(cache) {
            providers = cache;
        }
    });
    chat.providers!.fetch({});

    let matches:
        | Map<
              string,
              {
                  provider: models.Provider;
                  match: RegExpExecArray;
              }
          >
        | undefined;

    function filterProvider(url: string) {
        matches = new Map();
        return [...providers!.entries()].filter(([, provider]) => {
            const regex = new RegExp(provider.regex.replace(/\?P<(\w+)>/g, '?<$1>'));
            if (regex.test(url)) {
                const options = regex.exec(url);
                if (options) {
                    matches!.set(provider.id, {
                        provider: provider,
                        match: options
                    });
                }
                return true;
            }
            return false;
        });
    }

    let selectedProvider: models.Provider | undefined;

    function addChannel() {
        if (!selectedProvider) return;

        chat.channels!.add(
            new models.Channel({
                provider_id: selectedProvider.id,
                active: true,
                created_at: Date.now(),
                url: url,
                description: '',
                id: '',
                icon_url: '',
                name: ''
            })
        );
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

4<Screen title="add_channel">
    <div class="container">
        <input type="text" bind:value={url} placeholder="..." />
        {#if providers && providers.size}
            {#each filterProvider(url) as [provider_id, provider] (provider_id)}
                <button
                    class:active={selectedProvider === provider}
                    on:click={() => {
                        selectedProvider = provider;
                        addChannel();
                    }}
                >
                    {provider.name}
                </button>
            {/each}
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

    input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        font-size: 16px;
        background: var(--color-bg-2);
        border: 1px solid var(--color-1);
        border-radius: 0;

        &:focus {
            outline: none;
        }
    }

    button {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        font-size: 16px;
        color: var(--color-1);
        text-align: left;
        cursor: pointer;
        background: var(--color-bg-2);
        border: 1px solid var(--color-1);
        border-radius: 0;
        outline: none;

        &:hover {
            color: #fff;
            background-color: #000;
        }
    }
</style>
