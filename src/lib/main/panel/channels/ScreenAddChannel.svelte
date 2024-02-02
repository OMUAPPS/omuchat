<script lang="ts">
    import { models } from '@omuchatjs/chat';
    import { onMount } from 'svelte';

    import { getClient } from '$lib/common/omuchat/client.js';
    import ProviderIcon from '$lib/common/omuchat/ProviderIcon.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
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

    let input: HTMLInputElement | undefined;

    onMount(() => {
        input?.focus();
    });
</script>

<svelte:window on:keydown={onKeyPress} />

<Screen title="add_channel">
    <div class="container">
        <!-- svelte-ignore a11y-autofocus -->
        <span>
            <i class="ti ti-link" />
            <input type="text" bind:this={input} bind:value={url} placeholder="チャンネルURL..." autofocus={true}/>
        </span>
        <div class="providers">
            {#if providers && providers.size}
                {#each filterProvider(url) as [provider_id, provider] (provider_id)}
                    <button
                        class:active={selectedProvider === provider}
                        on:click={() => {
                            selectedProvider = provider;
                            addChannel();
                        }}
                    >
                        <ProviderIcon providerId={provider.id} />
                        {provider.name}
                        <small>
                            {provider.name}として追加
                        </small>
                        <i class="ti ti-arrow-right" />
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</Screen>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }

    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 40px;
        padding: 0 0 0 10px;
        font-size: 16px;
        color: var(--color-1);
        background: var(--color-bg-1);
        border: none;
        border-bottom: 1px solid var(--color-outline);
        border-radius: 0;

        i {
            margin-right: 10px;
            margin-left: 5px;
        }
    }

    input {
        width: 100%;
        height: 40px;
        min-height: 40px;
        font-size: 16px;
        background: var(--color-bg-1);
        border: none;
        border-bottom: 1px solid var(--color-outline);
        border-radius: 0;

        &:focus {
            outline: none;
        }
    }

    .providers {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow-y: auto;
        background: var(--color-bg-2);
        border: none;
        border-bottom: 1px solid var(--color-outline);
        border-radius: 0;

        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-track {
            background: var(--color-bg-2);
        }

        &::-webkit-scrollbar-thumb {
            background: var(--color-outline);
            border-radius: 10px;
        }
    }

    button {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 40px;
        padding: 0 10px 0 5px;
        font-size: 16px;
        color: var(--color-1);
        text-align: left;
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        border-bottom: 1px solid var(--color-outline);
        border-radius: 0;
        outline: none;

        &:hover {
            outline: 1px solid var(--color-1);
            outline-offset: -3px;

            &.active {
                outline: 1px solid var(--color-bg-1);
            }
        }

        small {
            margin-left: auto;
            font-size: 12px;
        }
    }

    .active {
        color: var(--color-bg-1);
        background: var(--color-1);
    }
</style>
