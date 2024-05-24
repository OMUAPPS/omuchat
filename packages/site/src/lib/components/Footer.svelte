<script>
    import { FlexColWrapper, FlexRowWrapper } from '@omujs/ui';
</script>

<footer>
    <FlexRowWrapper gap between heightFull>
        <FlexColWrapper gap>
            <p>Links</p>
            <p>
                <i class="ti ti-brand-github" />
                <a href="https://github.com/OMUAPPS/omuapps">Github</a>
                <i class="ti ti-external-link" />
            </p>
            <p>
                <i class="ti ti-brand-twitter" />
                <a href="https://twitter.com/omuapps">Twitter</a>
                <i class="ti ti-external-link" />
            </p>
            <p>
                <i class="ti ti-brand-discord" />
                <a href="https://discord.gg/MZKvbPpsuK">Discord</a>
                <i class="ti ti-external-link" />
            </p>
        </FlexColWrapper>
        <p style="text-align: end; margin-top: auto;">
            <a href="https://x.com/2ji_han">🕝</a>
        </p>
    </FlexRowWrapper>
</footer>

<style lang="scss">
    footer {
        height: fit-content;
        width: 100%;
        margin-top: 10rem;
        border-top: 1px solid var(--color-outline);
        color: var(--color-1);
        padding: 2rem 0;
    }

    a {
        font-weight: 200;
    }
</style>
