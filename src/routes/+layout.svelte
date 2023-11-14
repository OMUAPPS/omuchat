<script lang="ts">
    import { createI18nUnion } from '$lib/i18n/i18n';
    import { i18n } from '$lib/i18n/i18n-context';
    import { LOCALES } from '$lib/i18n/locales';
    import { language } from '$lib/main/settings';
    import './styles.scss';

    async function loadLocale() {
        const lang = await LOCALES[$language].load();
        const fallbackLang = await LOCALES['ja-JP'].load();

        if (lang !== fallbackLang) {
            i18n.set(createI18nUnion([lang, fallbackLang]));
        } else {
            i18n.set(lang);
        }
    }

    language.subscribe(loadLocale);
</script>

<div class="app">
    <main>
        {#await loadLocale()}
            <div>Loading...</div>
        {:then}
            <slot />
        {:catch error}
            <div>{error.message}</div>
        {/await}
    </main>
</div>
