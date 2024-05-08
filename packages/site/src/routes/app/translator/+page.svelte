<script lang="ts">
    import { ButtonMini, Combobox, FlexRowWrapper } from '@omuchatjs/ui';
    import { config } from './client.js';
    import { LANGUAGE_OPTIONS } from './translator.js';

    $: console.log($config.languages);
</script>

<main>
    <h3>翻訳言語</h3>
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
        width: min(100%, 300px);
        padding: 20px;
        margin-bottom: 20px;
        background: var(--color-bg-2);
        color: var(--color-1);
    }
</style>
