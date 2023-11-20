<div class="container">
    <div class="background a" />
    <div class="background b" />
</div>

<style lang="scss">
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: calc(100vw + tan(30deg) * 100vh);
        height: 100vh;
        pointer-events: none;
        background: var(--color-bg-1);
        opacity: 0.25;
        transform: matrix(1, 0, 0.5, 1, 0, 0) translateX(-30vh);
    }

    @keyframes bg1 {
        0% {
            transform: translate(200px, 0);
        }

        100% {
            transform: translate(0, 0);
        }
    }

    @keyframes bg2 {
        0% {
            transform: translate(100px, 50px);
        }

        100% {
            transform: translate(-100px, 50px);
        }
    }

    .background {
        position: absolute;
        inset: 0;
        background: url('/comment.svg') repeat;
        background-size: 200px 100px;
        object-fit: contain;

        &.a {
            animation: bg1 10s linear infinite;
        }

        &.b {
            animation: bg2 10s linear infinite;
        }
    }
</style>
