<script lang="ts">
    import type { models } from '@omuchat/client';
    import { onMount } from 'svelte';

    import ChannelEntry from './ChannelEntry.svelte';

    import Background from '$lib/common/Background.svelte';
    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import Button from '$lib/common/input/Button.svelte';
    import InputText from '$lib/common/input/InputText.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import Screen from '$lib/common/screen/Screen.svelte';
    import ScreenHeader from '$lib/common/screen/ScreenHeader.svelte';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';

    const { chat } = getClient();

    let result: Map<string, { channel: models.Channel; active: boolean }> | null = null;

    let locked = false;
    let url: string = '';

    function fetchChannels() {
        if (locked) return;
        locked = true;
        chat.fetchChannelsByUrl(url)
            .then((res) => {
                result = new Map(
                    [...res.entries()].map(([url, channel]) => {
                        return [url, { channel, active: true }];
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                locked = false;
            });
    }

    function finish() {
        if (!result?.size) return;
        const channels = [...result.values()]
            .filter((v) => v.active)
            .map((v) => v.channel);
        chat.channels!.add(...channels);
        screenContext.pop();
    }

    function reset() {
        result = null;
    }

    let tooltipHint: string;
    let hints = ['URL', '動画', '配信', 'プロフィール'];
    
    function updateHint() {
        tooltipHint = hints[hints.indexOf(tooltipHint) + 1] || hints[0];
    }

    onMount(() => {
        updateHint();
        const handle = setInterval(updateHint, 1400);

        return () => {
            clearInterval(handle);
        };
    });
</script>

<Screen title="setup" windowed={false} noDecorated>
    <div class="background">
        <Background />
    </div>
    <div class="container">
        <ScreenHeader title="setup" />
        {#if result !== null}
            {#if result.size > 0}
                <FlexColWrapper>
                    <div class="channels">
                        {#each result.entries() as [url, channel] (url)}
                            <ChannelEntry
                                channel={channel.channel}
                                active={channel.active}
                                callback={() => {
                                    if (!channel) return;
                                    channel.active = !channel.active;
                                }}
                            />
                        {/each}
                    </div>
                    <div class="buttons">
                        <Button
                            outline
                            rounded
                            callback={finish}
                            disabled={locked || Object.values(result).some((v) => !v.active)}
                        >
                            追加する
                            <i class="ti ti-arrow-right" />
                        </Button>
                        <Button rounded callback={reset} disabled={locked}>
                            <i class="ti ti-arrow-left" />
                            戻る
                        </Button>
                    </div>
                </FlexColWrapper>
            {:else}
                <div>チャンネルが見つかりませんでした…</div>
                <div class="buttons">
                    <Button rounded callback={reset} disabled={locked}>
                        <i class="ti ti-arrow-left" />
                        戻る
                    </Button>
                </div>
            {/if}
        {:else}
            <div>
                <Tooltip>
                    <div class="tooltip-container">
                        <small>あなたの</small>
                        <div class="tooltip">{tooltipHint}</div>
                        <small>
                            を入力！
                        </small>
                    </div>
                </Tooltip>
                <InputText placeholder="url..." bind:value={url} />
            </div>
            <div class="buttons">
                <Button outline rounded callback={fetchChannels} disabled={!url || locked}>
                    次へ
                    <i class="ti ti-arrow-right" />
                </Button>
                <Button rounded callback={screenContext.pop}>
                    スキップ
                    <i class="ti ti-arrow-right" />
                </Button>
            </div>
        {/if}
    </div>
</Screen>

<style lang="scss">
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--color-bg-2);
    }

    .container {
        position: fixed;
        top: 20%;
        left: 10%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
        justify-content: flex-start;
        width: 300px;
        min-width: 300px;
        height: 60%;
        padding: 40px;
        background: #fff;
        outline: 2px solid var(--color-1);
        box-shadow: 0 8px 0 2px var(--color-2);
    }

    small {
        font-weight: 500;
        opacity: 0.9;
    }

    .tooltip-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 20px;
    }

    .tooltip {
        width: 80px;
        font-weight: bold;
        animation: blink 1.4s cubic-bezier(0.43, -0.12, 0.45, 1.13) infinite;
        animation-delay: -0.15s;
    }

    @keyframes blink {
        0% {
            transform: translateY(1px);
        }
        5% {
            transform: translateY(-1px);
        }

        90% {
            transform: translateY(-1px);
        }

        95% {
            transform: translateY(0);
        }

        100% {
            transform: translateY(1px);
        }
    }

    .channels {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 60%;
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .buttons {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        width: 100%;
        margin-top: auto;
    }
</style>
