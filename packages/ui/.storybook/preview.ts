import type { Preview } from '@storybook/svelte';
import { decorators } from '../src/lib/decorators/index.js';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
    },
    decorators
};


export default preview;
