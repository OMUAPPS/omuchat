import { SvelteComponent, type ComponentType } from 'svelte';


export type TypedComponent<Props extends Record<string, unknown>> = ComponentType<SvelteComponent<Props>>;

export interface PropedComponent<Props extends Record<string, unknown> = Record<string, unknown>> {
    component: TypedComponent<Props>;
    props: Props;
}
