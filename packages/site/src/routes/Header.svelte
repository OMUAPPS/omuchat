<script>
    import { page } from '$app/stores';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import github from '$lib/images/github.svg';
    import title from '$lib/images/title.svg';
</script>

<header>
    <nav>
        <div class="title">
            <a href="/">
                <img src={title} alt="title" />
            </a>
        </div>
        <ul>
            <a href="/download">
                <li aria-current={$page.url.pathname.startsWith('/download') ? 'page' : undefined}>
                    <i class="ti ti-download" />
                    ダウンロード
                </li>
            </a>
            <a href="/apps">
                <li aria-current={$page.url.pathname.startsWith('/apps') ? 'page' : undefined}>
                    <i class="ti ti-search" />
                    アプリを探す
                </li>
            </a>
            <a href="/create">
                <li aria-current={$page.url.pathname.startsWith('/create') ? 'page' : undefined}>
                    <i class="ti ti-user" />
                    アプリを作る
                </li>
            </a>
        </ul>
        <div class="corner">
            <a href="https://github.com/OMUCHAT/omuchat-hub">
                <Tooltip>
                    <span> OMUCHAT/omuchat-hub </span>
                </Tooltip>
                <img src={github} alt="GitHub" />
            </a>
        </div>
    </nav>
</header>

<style lang="scss">
    header {
        position: relative;
        right: 0;
        left: 0;
        z-index: 100;
        display: flex;
        width: 100%;
        height: fit-content;
        padding: 1rem;
        background: var(--color-bg-2);
    }

    nav {
        container-type: inline-size;
        position: sticky;
        top: 0.5rem;
        right: 0;
        left: 0;
        box-sizing: border-box;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 64rem;
        height: 3em;
        margin: 0 auto;
    }

    li {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 1rem;
        font-size: 0;
        font-weight: 700;
        color: var(--color-text);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.1em;

        &:hover {
            color: var(--color-1);
        }

        &[aria-current='page'] {
            color: var(--color-bg-2);
            background: var(--color-1);
        }
    }

    .title {
        display: flex;
        align-items: center;
        height: 3em;
        margin: 0 1rem;

        img {
            height: 1.1rem;
        }
    }

    ul {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3em;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .corner {
        width: 2.5em;
        height: 2.5em;
        margin-left: auto;
    }

    i {
        font-size: 1.1rem;
    }

    @container (min-width: 750px) {
        li {
            font-size: 0.8rem;
        }
    }

    a {
        text-decoration: none;
    }
</style>
