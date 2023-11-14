<script lang="ts">
	import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
	import PropedComponent from '$lib/common/component/PropedComponent.svelte';
	import Button from '$lib/common/input/Button.svelte';
	import PopupHeader from '$lib/common/popup/PopupHeader.svelte';
	import { popupContext } from '$lib/common/popup/popup';
	import { t } from '$lib/i18n/i18n-context';
	import { writable } from 'svelte/store';
	import { SETTING_REGISTRY } from '../settings';
	import SettingsCredits from './SettingsCredits.svelte';
	const categories = [
		...Object.entries(SETTING_REGISTRY).map(([name, settings]) => {
			return {
				name,
				settings: Object.entries(settings).map(([name, setting]) => {
					return {
						name,
						...setting
					};
				})
			};
		}),
		{
			name: 'credits',
			settings: [
				{
					name: 'credits',
					component() {
						return {
							component: SettingsCredits,
							props: {}
						};
					}
				}
			]
		}
	];
	const currentCategory = writable(categories[0]);
</script>

<div class="container">
	<div class="header">
		<PopupHeader title="settings" />
		<div class="description">{$t('popup.settings.description')}</div>
	</div>
	<div class="close-button">
		<Button callback={popupContext.pop} outline rounded>
			<JustifyBaselineWrapper>
				{$t('general.close')}
				<i class="ti ti-x" />
			</JustifyBaselineWrapper>
		</Button>
	</div>
	<div class="content">
		<div class="categories">
			{#each categories as category}
				<button
					class="category"
					class:active={category === $currentCategory}
					on:click={() => currentCategory.set(category)}
				>
					{$t(`settings.category.${category.name}.name`)}
					<div class="description">
						{$t(`settings.category.${category.name}.description`)}
					</div>
				</button>
			{/each}
		</div>
		<div class="settings" class:fit={$currentCategory.name === 'credits'}>
			{#each $currentCategory.settings as setting}
				<PropedComponent component={setting.component()} />
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		position: relative;
		top: 40px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		height: calc(100% - 40px);
		padding: 0;
		background: var(--color-bg-2);
	}

	.content {
		display: flex;
		flex-direction: row;
		gap: 20px;
		width: 100%;
		height: 100%;
		padding: 20px;
	}

	.categories {
		width: 250px;
		height: calc(100% - 60px);
		border-right: 1px solid rgb(0 0 0 / 10%);
	}

	.settings {
		width: 300px;
		height: 100%;

		&.fit {
			width: calc(100% - 250px);
		}
	}

	.category {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 40px;
		padding: 0;
		padding-right: 10px;
		font-size: 16px;
		color: #666;
		appearance: none;
		background: none;
		border: none;
		transition: 0.03s;

		&:hover {
			color: var(--color-1);
		}

		&.active {
			padding-left: 10px;
			font-weight: bold;
			color: var(--color-1);
			background: var(--color-bg-2);
		}

		.description {
			margin-left: 10px;
			font-size: 10px;
			color: #999;
		}
	}

	.header {
		position: relative;
		top: 0;
		right: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		width: 100%;
		height: 80px;
		padding: 40px 20px;
		outline: 1px solid var(--color-1);

		.description {
			margin-left: 190px;
			font-size: 12px;
			color: #999;
		}
	}

	.close-button {
		position: absolute;
		bottom: 20px;
		left: 20px;
	}
</style>
