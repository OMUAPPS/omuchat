<script lang="ts">
	import { t } from '$lib/i18n/i18n-context';

	export let title = '';
</script>

<div class="header">
	<i class={$t(`popup.${title}.icon`)} />
	<div class="title">{$t(`popup.${title}.title`)}</div>
</div>

<style>
	.header {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 10px;
		color: var(--color-1);
		font-family: Noto Sans JP;
		font-size: 18px;
		font-style: normal;
		height: 40px;
		font-weight: 600;
		line-height: 0;
		user-select: none;
	}
</style>
