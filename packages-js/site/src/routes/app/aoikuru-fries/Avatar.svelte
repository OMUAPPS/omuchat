<script lang="ts">
    import hand_2 from './img/hand_2.png';
    
    export let position: { x: number, y: number };
</script>

<img src={hand_2} alt="" style="left: {position.x}px; top: {position.y}px;" />

<style lang="scss">
    img {
        position: absolute;
        width: 200px;
        transform: translate(-50%, -100%);
    }
</style>