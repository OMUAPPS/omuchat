<script>
    import ExternalLink from '$lib/common/input/ExternalLink.svelte';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { LICENCES } from '$lib/licence/licence';
</script>

<div class="container">
    {#each LICENCES as licence}
        <div class="licence">
            <div>
                <h3>
                    I love {licence.name}
                    <i class={licence.icon} />
                </h3>
                <ExternalLink href={licence.url} />
            </div>
            <small>by {licence.author}</small>
            <div class="content">
                <ExternalLink href={licence.licenceUrl} filled>
                    <Tooltip>
                        {licence.licenceName}
                    </Tooltip>
                </ExternalLink>
                {licence.licence}
            </div>
        </div>
    {/each}
    <!-- <div>
		<h3>
			I love Tabler icons
			<i class="ti ti-brand-tabler" />
		</h3>
		<ExternalLink href="https://tabler-icons.io/" />
	</div>
	<div>
		<h3>
			I love Svelte
			<i class="ti ti-heart" />
		</h3>
		<ExternalLink href="https://svelte.dev/" />
	</div>
	<div>
		<h3>
			I love SvelteKit
			<i class="ti ti-heart" />
		</h3>
		<ExternalLink href="https://kit.svelte.dev/" />
	</div> -->
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding-top: 40px;
        padding-left: 80px;
        overflow: auto;
    }

    .licence {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 100%;

        .content {
            margin-top: 10px;
            font-size: 10px;
            white-space: pre-wrap;
        }
    }

    h3 {
        font-size: 20px;
        color: var(--color-1);
    }
</style>
