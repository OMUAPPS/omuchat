<script lang="ts">
    import { Channel, type ChannelJson } from '@omuchat/client';
    import axios from 'axios';

    import ChannelEntry from './ChannelEntry.svelte';

    import Background from '$lib/common/Background.svelte';
    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import Button from '$lib/common/input/Button.svelte';
    import InputText from '$lib/common/input/InputText.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import { screenContext } from '$lib/common/screen/screen';
    import Screen from '$lib/common/screen/Screen.svelte';
    import ScreenHeader from '$lib/common/screen/ScreenHeader.svelte';

    const { chat } = getClient();

    interface Response {
        channels: ChannelJson[];
    }

    let result: Map<string, { channel: Channel; active: boolean }> | null = null;

    let locked = false;
    let url: string = '';

    function fetchChannels() {
        if (locked) return;
        locked = true;
        axios
            .post<Response>('http://localhost:26423/setup/tree', {
                url
            })
            .then((res) => {
                console.log(res);
                result = new Map(
                    res.data.channels.map((info) => {
                        return [
                            info.url,
                            {
                                channel: new Channel(info),
                                active: false
                            }
                        ];
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
        if (!result) return;
        const channels = Object.values(result)
            .filter((v) => v.active)
            .map((v) => v.channel);
        chat.channels!.add(...channels);
        screenContext.pop();
    }

    function reset() {
        result = null;
    }
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
                        {#each result.entries() as [, channel]}
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
                            disabled={locked || Object.values(result).every((v) => !v.active)}
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
                チャンネルurlを入力するだけ
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
        top: 40px;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        gap: 60px;
        align-items: center;
        justify-content: flex-start;
        width: 20%;
        min-width: 300px;
        padding-top: 60px;
        padding-right: 40px;
        padding-left: 40px;
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
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
        margin-top: 60px;
    }
</style>
