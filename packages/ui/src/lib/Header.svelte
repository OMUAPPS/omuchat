<script lang="ts">
	export let title: string;
	export let subtitle: string | undefined = undefined;
	export let icon: string;
</script>

<header>
	<div class="title">
		<i class="ti {icon}" />
		{title}
		{#if subtitle}
			<span class="subtitle">{subtitle}</span>
		{/if}
	</div>
	<slot />
</header>

<style lang="scss">
	header {
		display: flex;
		flex-direction: row;
		gap: 40px;
		align-items: center;
		width: 100%;
		min-height: 80px;
		padding: 20px;
		background: var(--color-bg-2);
		border-bottom: 1px solid var(--color-outline);
	}

	.title {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: baseline;
		padding-left: 20px;
		font-size: 18px;
		font-weight: 600;
		color: var(--color-1);
	}

	.subtitle {
		margin-left: 30px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-1);
	}
</style>
