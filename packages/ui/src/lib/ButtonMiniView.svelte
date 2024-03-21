<script lang="ts">
	import ButtonMini from './ButtonMini.svelte';
	import Theme from './Theme.svelte';
	import Tooltip from './Tooltip.svelte';

	export let icon: string;
	export let text: string;
</script>

<Theme />
<ButtonMini>
	<Tooltip>
		{text}
	</Tooltip>
	<i class="ti ti-{icon}" />aa
</ButtonMini>
