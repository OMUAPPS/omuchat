<div class="container">
    <div class="background a" />
    <div class="background b" />
    <div class="overlay" />
</div>

<style lang="scss">
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: calc(100vw + tan(30deg) * 100vh);
        height: 100vh;
        pointer-events: none;
        background: linear-gradient(180deg, #F1F6F7 0%, #EDF7FF 100%);
        transform: matrix(1, 0, 0.25, 1, 0, 0) translateX(-30vh);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(330deg, rgb(255 255 255 / 90%) 0%, rgb(237 247 255 / 50%) 100%);
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
        opacity: 0.5;

        &.a {
            animation: bg1 10s linear infinite;
        }

        &.b {
            animation: bg2 10s linear infinite;
        }
    }
</style>
