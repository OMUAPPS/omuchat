<script lang="ts">
    import { content } from '@omuchatjs/chat/models/index.js';

    export let component: content.Parent;

    function add(child: content.Component) {
        component.children = [...component.children, child];
    }

    type ComponentType = 'text' | 'image';

    function create(type: ComponentType) {
        switch (type) {
            case 'text':
                add(new content.Text(''));
                break;
            case 'image':
                add(new content.Image('', '', ''));
                break;
        }
    }

    let select: HTMLSelectElement;

    function handle(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = target.value as ComponentType;
        create(value);
        target.selectedIndex = 0;
    }
</script>

<span>
    <select bind:this={select} on:change={(event) => handle(event)}>
        <option disabled selected>追加</option>
        <option value="text" on:change={() => create('text')}>テキスト</option>
        <option value="image" on:change={() => create('image')}>画像</option>
    </select>
</span>

<style>
    span {
        display: block;
    }
</style>
