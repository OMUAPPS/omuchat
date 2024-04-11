<script lang="ts">
    import { page } from '$app/stores';
    import { AppHeader, FlexRowWrapper } from '@omuchatjs/ui';
    import { client } from './client.js';
    import ReactionRenderer from './components/ReactionRenderer.svelte';
    import { REACTION_MESSAGE_TYPE } from './reaction.js';

    let assetUrl = $page.url.toString() + 'asset?id=' + Date.now();

    const reactions = client.message.get(REACTION_MESSAGE_TYPE);

    function test() {
        reactions.broadcast({
            room_id: 'test',
            reactions: {
                '😳': 1,
                '😄': 1,
                '❤': 1,
                '🎉': 1,
                '💯': 1,
            },
        });
    }
</script>

<AppHeader app={client.app} />
<main>
    <section>
        <FlexRowWrapper gap>
            <button on:click={test}>
                <i class="ti ti-send" />
                Send
            </button>
        </FlexRowWrapper>
    </section>
    <h3>貼り付け</h3>
    <section>
        <a href={assetUrl} target="_blank">
            <img src={assetUrl} alt="asset" />
        </a>
    </section>
    <ReactionRenderer {client} />
</main>

<style lang="scss">
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        height: 100vh;
        background: var(--color-bg-1);
        padding: 40px;
    }

    h3 {
        color: var(--color-1);
        margin-bottom: 10px;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        padding: 0px;
        margin-bottom: 20px;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        margin: 0;
        height: 30px;
        padding: 10px;
        display: flex;
        font-size: 14px;
        align-items: center;
        justify-content: center;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 1px solid var(--color-1);
        outline-offset: -1px;
        border-radius: 4px;

        &:hover {
            background: var(--color-bg-1);
        }

        &:active {
            background: var(--color-1);
            color: var(--color-bg-2);
        }
    }
</style>
