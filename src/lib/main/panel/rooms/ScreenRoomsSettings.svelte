<script lang="ts">
    import InputText from '$lib/common/input/InputText.svelte';
    import Screen from '$lib/common/screen/Screen.svelte';
</script>

<Screen title="設定">
    <div class="container">
        <InputText />
    </div>
</Screen>

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
