<script lang="ts">
	import { translate } from './stores.js';
	export let date: Date | undefined;

	let formattedDate: string = '';
	let timer: number;

	const timeUnits = [
		{ label: 'date.years_ago', value: 1000 * 60 * 60 * 24 * 365.25 },
		{ label: 'date.months_ago', value: 1000 * 60 * 60 * 24 * 30.5 },
		{ label: 'date.weeks_ago', value: 1000 * 60 * 60 * 24 * 7 },
		{ label: 'date.days_ago', value: 1000 * 60 * 60 * 24 },
		{ label: 'date.hours_ago', value: 1000 * 60 * 60 },
		{ label: 'date.minutes_ago', value: 1000 * 60 },
		{ label: 'date.seconds_ago', value: 1000 }
	];

	function delay(ms: number) {
		if (timer) {
			window.clearTimeout(timer);
		}
		timer = window.setTimeout(() => {
			timer = 0;
			formatDate(date);
		}, ms);
	}

	function formatDate(date: Date | undefined) {
		if (!date) {
			formattedDate = '';
			return;
		}
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		if (diff < 0) {
			formattedDate = $translate('date.in_the_future');
		}

		for (let i = 0; i < timeUnits.length; i++) {
			const unit = timeUnits[i];
			const diffValue = Math.floor(diff / unit.value);
			if (diffValue > 0) {
				formattedDate = $translate(unit.label, {
					time: diffValue
				});
				delay(unit.value - (diff % timeUnits[i].value));
				break;
			}
		}

		if (!formattedDate) {
			formattedDate = $translate('date.just_now');
			delay(1000 - (diff % 1000));
		}
	}

	$: {
		if (timer) {
			window.clearTimeout(timer);
		}
		formatDate(date);
	}
</script>

{#if formattedDate}
	{formattedDate}
{/if}
