<script lang="ts">
    import { page } from '$app/stores';
    import { Omu } from '@omujs/omu';
    import { AppHeader, Combobox, DragLink, FlexRowWrapper, Textbox, setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import CaptionRenderer from './CaptionRenderer.svelte';
    import { APP } from './app.js';
    import { CaptionApp } from './caption-app.js';
    import { LANGUAGES_OPTIONS, type LanguageKey } from './types.js';

    export const omu = new Omu(APP);
    setClient(omu);
    const captionApp = new CaptionApp(omu);
    const config = captionApp.config;

    if (BROWSER) {
        const recognition = new (webkitSpeechRecognition || SpeechRecognition)();
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.lang = $config.lang;
        config.subscribe((value) => {
            recognition.lang = value.lang;
        });

        recognition.onresult = (event) => {
            const texts = [...event.results]
                .flatMap((result) => [...result])
                .map((result) => result.transcript);
            const final = event.results[event.results.length - 1].isFinal;
            captionApp.setCaption({ texts, final });
        };

        recognition.onend = () => {
            recognition.start();
        };

        recognition.start();

        omu.start();
    }

    function createAssetUrl() {
        const url = new URL($page.url);
        url.pathname = `${url.pathname}asset`;
        url.searchParams.set('assetId', Date.now().toString());
        return url;
    }

    function resetLang() {
        $config.lang = window.navigator.language as LanguageKey;
        updateConfig();
    }

    function updateConfig() {
        $config = { ...$config };
    }
</script>

<svelte:head>
    <title>リアルタイム字幕</title>
    <meta name="description" content="リアルタイム字幕" />
</svelte:head>

<AppHeader app={APP} />
<section>
    <h3>言語選択</h3>
    <FlexRowWrapper gap>
        <Combobox
            options={LANGUAGES_OPTIONS}
            defaultValue={$config.lang}
            handleChange={(key, value) => {
                $config.lang = value;
                updateConfig();
            }}
        />
        {#if BROWSER && $config.lang !== window.navigator.language}
            <button on:click={resetLang}> 言語をリセット </button>
        {/if}
    </FlexRowWrapper>
</section>
<section>
    <FlexRowWrapper gap alignItems="end" between>
        <h3>フォント</h3>
        <button
            on:click={() => {
                $config.style.fonts = [...$config.style.fonts, { family: '', url: '' }];
                updateConfig();
            }}
            class="add-font"
        >
            フォント追加
            <i class="ti ti-plus" />
        </button>
    </FlexRowWrapper>
    <div>
        <small> フォントサイズ </small>
        <input
            type="range"
            min="10"
            max="100"
            step="1"
            bind:value={$config.style.fontSize}
            on:mouseup={updateConfig}
            on:keyup={updateConfig}
        />
        {$config.style.fontSize}
    </div>
    <div class="font-list">
        {#each $config.style.fonts as font, i}
            <span class="font">
                <span>
                    <small> ファミリー </small>
                    <Textbox
                        value={font.family}
                        on:input={(value) => {
                            $config.style.fonts[i].family = value.detail.value;
                            updateConfig();
                        }}
                    />
                </span>
                <span>
                    <small> URL </small>
                    <Textbox
                        value={font.url}
                        on:input={(value) => {
                            $config.style.fonts[i].url = value.detail.value;
                            updateConfig();
                        }}
                    />
                </span>
                <button
                    on:click={() => {
                        $config.style.fonts = $config.style.fonts.filter((_, j) => i !== j);
                        updateConfig();
                    }}
                >
                    削除
                    <i class="ti ti-x" />
                </button>
            </span>
        {/each}
    </div>
</section>
<section>
    <DragLink href={createAssetUrl}>
        <h3 slot="preview" class="drag-preview">
            これをOBSにドロップ
            <i class="ti ti-upload" />
        </h3>
        <div class="drag">
            <i class="ti ti-drag-drop" />
            ここをOBSにドラッグ&ドロップ
        </div>
    </DragLink>
</section>
<section class="preview">
    <small>字幕のプレビュー</small>
    <CaptionRenderer {captionApp} />
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 2rem;
        color: var(--color-1);
    }

    .preview {
        position: relative;
        margin-top: 2rem;
        outline: 1px solid var(--color-1);
        background: var(--color-bg-2);
        min-height: 200px;
        height: 100%;
    }

    .font-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .font {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        background: var(--color-bg-2);
        padding: 0.25rem 1rem;

        small {
            font-size: 0.7rem;
        }

        button {
            margin-left: auto;
            background: var(--color-bg-1);
        }

        &:hover {
            border-left: 2px solid var(--color-1);
        }
    }

    h3 {
        font-size: 1.1rem;
    }

    .add-font {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        background: var(--color-bg-2);
        width: fit-content;
        align-self: flex-end;
    }

    .drag-preview {
        padding: 10px 20px;
        background: var(--color-bg-2);
    }

    .drag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
        padding: 10px;
        gap: 5px;
        cursor: grab;

        & > i {
            font-size: 20px;
        }

        &:hover {
            margin-left: 4px;
            outline: 2px solid var(--color-1);
            box-shadow: -4px 4px 0 2px var(--color-2);
            transition: 0.06233s;
        }
    }

    button {
        border: none;
        background: var(--color-bg-2);
        color: var(--color-1);
        font-weight: 600;
        font-size: 0.8rem;
        outline: 1px solid var(--color-1);
        padding: 0.5rem 0.75rem;
        cursor: pointer;

        &:hover {
            background: var(--color-1);
            color: var(--color-bg-2);
        }

        &:focus {
            outline: 2px solid var(--color-1);
        }
    }
</style>
