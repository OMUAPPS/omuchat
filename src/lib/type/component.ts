import type { ComponentType, SvelteComponent } from "svelte";

export interface PropedComponent<Props extends Record<string, any> = any> {
    component: ComponentType<SvelteComponent<Props>>;
    props: Props;
}