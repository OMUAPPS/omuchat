<script lang="ts">
    import type { models } from '@omuchatjs/chat';

    import { t } from '$lib/i18n/i18n-context.js';

    import { getClient } from '$lib/common/omuchat/client.js';
    import { dateTimeFormats } from '$lib/const.js';
    import { applyOpacity, style } from '$lib/utils/class-helper.js';
    import { ClipboardHelper } from '$lib/utils/clipboard-helper.js';
    import {
        ComponentRenderer,
        FlexColWrapper,
        FlexRowWrapper,
        Gift,
        RelativeDate,
        Role,
        Tooltip,
    } from '@omuchatjs/ui';

    export let entry: models.Message;
    export let selected: boolean = false;

    const { chat, client } = getClient();

    let author: models.Author | undefined;

    if (entry.authorId) {
        chat.authors.get(entry.authorId).then((res) => {
            author = res;
        });
    }

    function handleCopy() {
        ClipboardHelper.writeText(entry.text);
    }

    function handleBookmark() {
        console.log('bookmark');
    }
</script>

<article
    class:special={!!(entry.paid || entry.gifts?.length)}
    class:selected
    style={style(
        entry.paid || entry.gifts?.length
            ? {
                  background: `${applyOpacity(entry.paid ? 'var(--color-1)' : 'var(--color-2)', 0.1)}`,
              }
            : {},
    )}
>
    <FlexRowWrapper widthFull gap>
        {#if author && author.avatarUrl}
            <FlexColWrapper>
                <img
                    src={client.assets.proxy(author.avatarUrl)}
                    alt="avatar"
                    class="author-avatar"
                    width="32"
                    height="32"
                />
                <Tooltip noBackground>
                    <img
                        src={client.assets.proxy(author.avatarUrl)}
                        alt="avatar"
                        class="author-avatar-preview"
                    />
                </Tooltip>
            </FlexColWrapper>
        {/if}
        <FlexColWrapper widthFull>
            {#if author}
                <FlexRowWrapper widthFull gap>
                    <FlexRowWrapper baseline>
                        <span class="name">
                            {author.name}
                        </span>
                        {#each author.roles || [] as role}
                            <Role {role} />
                        {/each}
                        <small>
                            {author.screenId || author.id}
                        </small>
                    </FlexRowWrapper>
                    {#if entry.createdAt}
                        <span class="time">
                            <Tooltip>
                                {$dateTimeFormats.full.format(entry.createdAt)}
                            </Tooltip>
                            <RelativeDate date={entry.createdAt} />
                        </span>
                    {/if}
                </FlexRowWrapper>
                <FlexRowWrapper widthFull between>
                    <FlexColWrapper>
                        {#if entry.content}
                            <div class="message-content">
                                <ComponentRenderer component={entry.content} />
                            </div>
                        {/if}
                        {#if entry.paid}
                            <div class="paid">
                                {entry.paid.currency}{entry.paid.amount}
                            </div>
                        {/if}
                        {#if entry.gifts?.length}
                            <div>
                                {#each entry.gifts as gift}
                                    <Gift {gift} />
                                {/each}
                            </div>
                        {/if}
                    </FlexColWrapper>
                    {#if selected}
                        <div class="actions">
                            <button on:click={handleBookmark}>
                                <Tooltip>{$t('panels.messages.bookmark')}</Tooltip>
                                <i class="ti ti-bookmark" />
                            </button>
                            <button on:click={handleCopy}>
                                <Tooltip>{$t('panels.messages.copy')}</Tooltip>
                                <i class="ti ti-files" />
                            </button>
                        </div>
                    {/if}
                </FlexRowWrapper>
            {:else}
                <FlexRowWrapper widthFull between>
                    <FlexColWrapper>
                        {#if entry.content}
                            <div class="message-content">
                                <ComponentRenderer component={entry.content} />
                            </div>
                        {/if}
                        {#if entry.paid}
                            <div class="paid">
                                {entry.paid.currency}{entry.paid.amount}
                            </div>
                        {/if}
                        {#if entry.gifts?.length}
                            <div>
                                {#each entry.gifts as gift}
                                    <Gift {gift} />
                                {/each}
                            </div>
                        {/if}
                    </FlexColWrapper>
                    {#if entry.createdAt}
                        <span class="time">
                            <Tooltip>
                                {$dateTimeFormats.full.format(entry.createdAt)}
                            </Tooltip>
                            <RelativeDate date={entry.createdAt} />
                        </span>
                    {/if}
                </FlexRowWrapper>
            {/if}
        </FlexColWrapper>
    </FlexRowWrapper>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 15px;
        font-weight: 500;
        border-bottom: 1px solid var(--color-bg-1);

        &.selected {
            background: var(--color-bg-1);
            outline: 1px solid var(--color-1);
            outline-offset: -4px;
        }
    }

    .special {
        border-left: 2px solid var(--color-1);
    }

    .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .author-avatar-preview {
        width: 128px;
        height: 128px;
        outline: 2px solid #000;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-1);
        border: none;
        outline: none;

        &:hover {
            color: var(--color-bg-1);
            background: var(--color-1);
        }

        &:focus {
            outline: 1px solid var(--color-1);
            outline-offset: -1px;
        }
    }

    .name {
        margin-right: 5px;
        white-space: nowrap;
        user-select: text;
    }

    small {
        font-size: 0.6rem;
        color: #999;
    }

    .time {
        padding: 2px 0;
        margin-left: auto;
        font-size: 0.8rem;
        color: #666;
        user-select: text;
    }

    .message-content {
        overflow: clip;
        font-size: 0.9rem;
        text-wrap: wrap;
        word-break: auto-phrase;
        overflow-wrap: break-word;
        white-space: pre-line;
        user-select: text;
    }

    .paid {
        width: 100%;
        padding: 2px;
        font-size: 0.8rem;
        font-weight: bold;
        color: var(--color-1);
        user-select: text;
    }

    .actions {
        display: flex;
        align-self: flex-end;
    }
</style>
