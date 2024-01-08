<script lang="ts">
    import type { PropedComponent } from './proped-component.js';
    export let component: PropedComponent;
</script>

<svelte:component this={component.component} {...component.props} />
