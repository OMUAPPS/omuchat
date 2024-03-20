<script lang="ts">
    import title from '$lib/images/title.svg';
    import { client } from './client.js';

    client.network.listeners.disconnected.subscribe(() => {
        window.location.href = '/download';
    });
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>
        <span class="welcome">
            <img src={title} alt="title" />
            <p class="info">おむちゃっとは、配信者と視聴者をつなぐAPIです。</p>
        </span>
    </h1>
</section>

<style lang="scss">
    section {
        container-type: inline-size;
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        padding: 0 1rem;
    }

    h1 {
        width: 100%;
    }

    .info {
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-1);
        background: var(--color-bg-2);
    }

    p {
        margin-top: 10rem;
        text-wrap: nowrap;
    }

    .welcome {
        position: relative;
        display: block;
        width: 100%;
        height: 0;
        padding: 0 0 calc(max(100% * 400 / 2048, 100px) + 0.5rem) 0;
        margin-top: 10rem;

        img {
            position: absolute;
            top: 0;
            display: block;
            height: 40%;
        }

        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            font-weight: 700;
        }
    }

    @container (max-width: 480px) {
        section {
            padding: 0 0.5rem;
        }

        .welcome {
            margin-top: 5rem;
        }

        p {
            margin-top: 5rem;

            a {
                font-size: 0.8rem;
            }
        }

        .info {
            font-size: 0.8rem;
        }

        button {
            font-size: 0.8rem;
        }
    }
</style>
