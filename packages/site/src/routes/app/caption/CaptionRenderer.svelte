<script lang="ts">
    import type { CaptionApp } from './caption-app.js';

    export let captionApp: CaptionApp;

    let text = '';
    captionApp.listen((caption) => {
        text = caption.texts.join(' ');
    });
</script>

<h1>{text}</h1>
