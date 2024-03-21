<script lang="ts">
	import Tooltip from './Tooltip.svelte.js';

	export let text: string;
	export let image: string;
</script>

<Tooltip>
	{text}
</Tooltip>
<Tooltip>
	<img src={image} alt={text} />
</Tooltip>
