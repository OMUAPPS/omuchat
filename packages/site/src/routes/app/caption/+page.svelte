<script lang="ts">
    import { App, Omu } from '@omujs/omu';
    import { IDENTIFIER } from './app.js';
    import { CaptionApp, LANGUAGES, LANGUAGES_OPTIONS } from './caption-app.js';
    import { BROWSER } from 'esm-env';
    import CaptionRenderer from './CaptionRenderer.svelte';
    import { Combobox } from '@omujs/ui';

    export const omu = new Omu(
        new App(IDENTIFIER, {
            version: '1.0.0',
        }),
    );
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
            console.log(texts);
            captionApp.setCaption({ texts, final });
        };

        recognition.onend = () => {
            recognition.start();
        };

        recognition.start();

        omu.start();
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <small> こっちでSpeechRecognition使って音声認識してる </small>
    <CaptionRenderer {captionApp} />
    <Combobox
        options={LANGUAGES_OPTIONS}
        defaultValue={$config.lang}
        handleChange={(key, value) => {
            $config.lang = value;
        }}
    />
</section>

<style>
    section {
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
