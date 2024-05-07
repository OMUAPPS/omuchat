<script lang="ts">
    import { createRegistryStore } from '$lib/helper.js';
    import { AppHeader, ButtonMini, Combobox, FlexRowWrapper } from '@omuchatjs/ui';
    import { client } from './client.js';
    import { CONFIG_REGISTRY_TYPE, LANGUAGE_OPTIONS } from './translator.js';

    const config = createRegistryStore(client, CONFIG_REGISTRY_TYPE);

    function toggle() {
        $config = {
            ...$config,
            active: !$config.active,
        };
    }

    $: console.log($config.languages);
</script>

<AppHeader app={client.app} />
<main>
    <h3>オン/オフ</h3>
    <section>
        <button on:click={toggle} class:active={$config.active}>
            {$config.active ? 'オン' : 'オフ'}
        </button>
    </section>

    <h3>言語</h3>
    <section>
        {#each $config.languages as language, i (i)}
            <FlexRowWrapper>
                <Combobox
                    options={LANGUAGE_OPTIONS}
                    defaultValue={language}
                    handleChange={(key, language) => {
                        $config = {
                            ...$config,
                            languages: $config.languages.map((l, j) => (i === j ? language : l)),
                        };
                    }}
                />
                <ButtonMini
                    on:click={() => {
                        $config = {
                            ...$config,
                            languages: $config.languages.filter((_, j) => i !== j),
                        };
                    }}
                >
                    <i class="ti ti-x" />
                </ButtonMini>
            </FlexRowWrapper>
        {/each}
        <ButtonMini
            on:click={() => {
                $config = { ...$config, languages: [...$config.languages, 'ja'] };
            }}
        >
            言語を追加
            <i class="ti ti-plus" />
        </ButtonMini>
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
        padding: 40px;
    }

    h3 {
        color: var(--color-1);
        margin-bottom: 10px;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        padding: 0px;
        margin-bottom: 20px;
    }
</style>
