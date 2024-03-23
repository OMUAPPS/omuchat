<script lang="ts">
    import { type Component } from '@omuchatjs/chat/models/content.js';
    import { content } from '@omuchatjs/chat/models/index.js';
    import {
        ComponentRenderer,
        FlexColWrapper,
        FlexRowWrapper,
        Header,
        MessageRenderer,
    } from '@omuchatjs/ui';
    import { client } from './client.js';
    import ComponentEditor from './components/ComponentEditor.svelte';

    const chat = client.chat;

    let component: Component = new content.Root([
        new content.Text('Hello, World!'),
        new content.Text('This is a test.'),
    ]);

    function resetComponent() {
        component = new content.Root([
            new content.Text('Hello, World!'),
            new content.Text('This is a test.'),
        ]);
    }

    function reset() {
        resetComponent();
    }
</script>

<Header title="テスター" icon="ti-text-size" />
<main>
    <section>
        <button on:click={reset}>
            <i class="ti ti-reload" />
            Reset
        </button>
    </section>
    <h3>
        <i class="ti ti-pencil" />
        Content
    </h3>
    <section>
        <FlexRowWrapper widthFull gap between>
            <FlexColWrapper widthFull heightFull>
                <small>INPUT</small>
                <div class="editor">
                    <ComponentEditor bind:component remove={resetComponent} />
                </div>
            </FlexColWrapper>
            <FlexColWrapper widthFull heightFull>
                <small>JSON</small>
                <pre>{JSON.stringify(content.serialize(component), null, 4)}</pre>
            </FlexColWrapper>
        </FlexRowWrapper>
        <ComponentRenderer {component} />
    </section>
    <h3>
        <i class="ti ti-eye" />
        Preview
    </h3>
    <section class="fill">
        <MessageRenderer bind:content={component} />
    </section>
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
        padding: 10px;
        margin-bottom: 20px;

        &.fill {
            background: var(--color-bg-2);
        }
    }

    small {
        color: var(--color-1);
    }

    .editor {
        background: var(--color-bg-2);
        width: 100%;
        height: 100%;
        padding: 5px;
    }

    pre {
        background: var(--color-bg-2);
        width: 100%;
        overflow: auto;
        font-size: 12px;
        padding: 5px;
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
        background: var(--color-bg-1);
        outline: 1px solid var(--color-1);
        outline-offset: -1px;
        border-radius: 4px;

        &:hover {
            background: var(--color-bg-2);
        }

        &:active {
            background: var(--color-1);
            color: var(--color-bg-2);
        }
    }
</style>
