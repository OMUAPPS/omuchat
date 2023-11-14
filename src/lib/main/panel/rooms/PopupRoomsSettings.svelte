<script lang="ts">
	import InputText from '$lib/common/input/InputText.svelte';
	import Popup from '../../../common/screen/Screen.svelte';
</script>

<Popup title="設定" icon="ti ti-home">
	<div class="container">
		<InputText />
	</div>
</Popup>

<style lang="scss">
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
