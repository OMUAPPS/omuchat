<script lang="ts">
	import type { ChannelInfo } from '@/omuchat';

	export let channel: ChannelInfo;
	export let active = false;
	export let callback = () => {};
</script>

<button class="channel-entry" class:active on:click={callback}>
	<div class="icon">
		<img src={channel.icon_url} alt="icon" />
	</div>
	<div class="info">
		<div class="name">{channel.name}</div>
		<div class="provider">{channel.provider_id}</div>
	</div>
	<i class={active ? `ti ti-check` : `ti ti-plus`} />
</button>

<style lang="scss">
	.channel-entry {
		width: 100%;
		height: 60px;
		display: flex;
		align-items: center;
		padding: 10px;
		border: 1px solid var(--color-bg-2);
		background: var(--color-bg-1);
		cursor: pointer;

		&:hover {
			background: var(--color-bg-2);
		}

		.icon {
			min-width: 32px;
			width: 32px;
			min-height: 32px;
			height: 32px;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 10px;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		.info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			width: 100%;
		}

		.name {
			font-size: 16px;
		}

		.provider {
			font-size: 12px;
			opacity: 0.5;
		}

		&.active {
			background: var(--color-1);
			color: var(--color-bg-2);

			.name {
				font-weight: bold;
			}
		}
	}
</style>
