<script lang="ts">
    import { AppHeader, ButtonMini, Combobox, FlexRowWrapper, Toggle } from '@omujs/ui';
    import { config } from './client.js';
    import { LANGUAGE_OPTIONS, type Language } from './translator.js';
    import AppPage from '$lib/components/AppPage.svelte';
    import { APP } from './app.js';

    $: console.log($config.languages);

    function changeLanguage(language: Language, i: number) {
        $config = {
            ...$config,
            languages: $config.languages.map((l, j) => (i === j ? language : l)),
        };
    }
</script>

<AppPage>
    <header slot="header">
        <AppHeader app={APP}>
            <FlexRowWrapper alignItems="center" gap>
                <small>オン/オフ</small>
                <Toggle bind:value={$config.active} />
            </FlexRowWrapper>
        </AppHeader>
    </header>

    <main>
        <h3>翻訳言語</h3>
        <section>
            {#each $config.languages as language, i}
                <FlexRowWrapper>
                    <Combobox
                        options={LANGUAGE_OPTIONS}
                        defaultValue={language}
                        handleChange={(_, language) => changeLanguage(language, i)}
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
</AppPage>

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
