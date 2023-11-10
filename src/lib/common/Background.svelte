<div class="container">
	<div class="background a" />
	<div class="background b" />
</div>

<style lang="scss">
	.container {
		position: fixed;
		top: 0;
		left: -100vh;
		right: -100vh;
		bottom: 0;
		transform: matrix(1, 0, 0.5, 1, 0, 0) translateX(-30vh);
		-ms-transform: matrix(1, 0, 0.5, 1, 0, 0) translateX(-30vh);
		-webkit-transform: matrix(1, 0, 0.5, 1, 0, 0) translateX(-30vh);
		opacity: 0.25;
		pointer-events: none;
		background: var(--color-bg-1);
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
		top: 10px;
		left: -100vh;
		right: -100vh;
		bottom: 0;
		background: url(/comment.svg) repeat;
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
