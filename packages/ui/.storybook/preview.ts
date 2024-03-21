import type { Preview } from '@storybook/svelte';
import ThemeDecorator from '../src/lib/decorators/ThemeDecorator.svelte';
import TranslateDecorator from '../src/lib/decorators/TranslateDecorator.svelte';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
    },
    decorators: [
        () => ThemeDecorator as any,
        () => TranslateDecorator as any,
    ]
};


export default preview;
