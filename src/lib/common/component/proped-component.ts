import type { ComponentType, SvelteComponent } from 'svelte';

export interface PropedComponent<Props extends Record<string, unknown>> {
    component: ComponentType<SvelteComponent<Props>>;
    props: Props;
}
