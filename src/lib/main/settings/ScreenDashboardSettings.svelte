<script lang="ts">
    import { writable } from 'svelte/store';

    import { currentSettingsCategory, SETTING_REGISTRY } from '../settings';

    import SettingsCredits from './SettingsCredits.svelte';

    import PropedComponent from '$lib/common/component/PropedComponent.svelte';
    import Button from '$lib/common/input/Button.svelte';
    import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import ScreenHeader from '$lib/common/screen/ScreenHeader.svelte';
    import { t } from '$lib/i18n/i18n-context';
    const categories = [
        ...Object.entries(SETTING_REGISTRY).map(([name, settings]) => {
            return {
                name,
                settings: Object.entries(settings).map(([name, setting]) => {
                    return {
                        name,
                        ...setting
                    };
                })
            };
        }),
        {
            name: 'credits',
            settings: [
                {
                    name: 'credits',
                    component() {
                        return {
                            component: SettingsCredits,
                            props: {}
                        };
                    }
                }
            ]
        }
    ];

    const currentCategory = writable(categories[0]);
    currentSettingsCategory.subscribe((category) => {
        currentCategory.set(categories.find((c) => c.name === category)!);
    });
    $: $currentSettingsCategory = $currentCategory.name;
</script>

<div class="container">
    <div class="header">
        <ScreenHeader title="settings" />
        <div class="description">{$t('screen.settings.description')}</div>
    </div>
    <div class="close-button">
        <Button on:click={screenContext.pop} outline rounded filled>
            <JustifyBaselineWrapper>
                {$t('general.close')}
                <i class="ti ti-x" />
            </JustifyBaselineWrapper>
        </Button>
    </div>
    <div class="content">
        <div class="categories">
            {#each categories as category (category.name)}
                <button
                    class="category"
                    class:active={category === $currentCategory}
                    on:click={() => currentCategory.set(category)}
                >
                    <div class="name">
                        <i class={`ti ti-${$t(`settings.category.${category.name}.icon`)}`} />
                        {$t(`settings.category.${category.name}.name`)}
                    </div>
                    <div class="description">
                        {$t(`settings.category.${category.name}.description`)}
                    </div>
                </button>
            {/each}
        </div>
        <div class="settings" class:fit={$currentCategory.name === 'credits'}>
            {#each $currentCategory.settings as setting (setting.name)}
                <PropedComponent component={setting.component()} />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .container {
        position: relative;
        top: 40px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: calc(100% - 40px);
        padding: 0;
        background: var(--color-bg-2);
    }

    .content {
        display: flex;
        flex-direction: row;
        gap: 20px;
        width: 100%;
        height: 100%;
    }

    .settings {
        width: 300px;
        height: calc(100% - 60px);
        padding-top: 40px;
        padding-bottom: 40px;
        overflow-y: auto;

        &.fit {
            width: calc(100% - 320px);
        }
    }

    .categories {
        width: 300px;
        height: 100%;
        padding-top: 40px;
        background: var(--color-bg-1);
        border-right: 1px solid rgb(0 0 0 / 10%);
    }

    .category {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        height: 60px;
        padding: 10px;
        padding-left: 40px;
        font-size: 16px;
        color: #666;
        appearance: none;
        background: none;
        border: none;
        transition: 0.03s;

        &:hover {
            background: var(--color-bg-2);
        }

        &.active {
            z-index: 1;
            padding-left: 50px;
            font-weight: bold;
            color: var(--color-1);
            background: var(--color-bg-2);
            outline: 2px solid var(--color-1);

            &::after {
                position: absolute;
                top: 50%;
                right: 0;
                content: '';
                border: 8px solid transparent;
                border-left-color: var(--color-1);
                transform: translate(100%, -50%);
            }

            &::before {
                position: absolute;
                top: 50%;
                left: 0;
                content: '';
                border: 8px solid transparent;
                border-right-color: var(--color-1);
                transform: translate(-100%, -50%);
            }
        }

        .name {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            font-size: 16px;
            font-weight: bold;

            i {
                font-size: 20px;
            }
        }

        .description {
            margin-left: 10px;
            font-size: 10px;
            color: #999;
        }
    }

    .header {
        position: relative;
        top: 0;
        right: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        align-items: baseline;
        width: 100%;
        height: 80px;
        padding: 40px 20px;
        outline: 1px solid var(--color-1);

        .description {
            margin-left: 190px;
            font-size: 12px;
            color: #999;
        }
    }

    .close-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
    }
</style>
