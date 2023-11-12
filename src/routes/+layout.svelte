<script lang="ts">
	import { i18n } from '$lib/i18n/i18n-context';
	import { LOCALES } from '$lib/i18n/locales';
	import { language } from '$lib/main/settings';
	import './styles.scss';

	async function loadLocale() {
		const i = await LOCALES[$language].load();
		i18n.set(i);
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
