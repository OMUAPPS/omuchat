<script lang="ts">
    import { onMount } from "svelte";

    import { client, reactions, type Reaction } from "./reaction";
    import ReactionEntry from "./ReactionEntry.svelte";
    
    interface ReactionMessage {
        room_id: string;
        reactions: Record<string, number>;
    }
    const queue: Reaction[] = [];
    let id = 0;
    client.omu.message.listen<ReactionMessage>({
        name: "youtube-reaction",
        app: "omu/chatprovider",
    }, (data) => {
        for (const [key, value] of Object.entries(data.reactions)) {
            for (let i = 0; i < value; i++) {
                id++;
                queue.push({
                    id,
                    key,
                });
            }
        }
    });
    client.omu.message.listen({
        name: "test",
        app: "omu-apps/youtube-reaction",
    }, () => {
        queue.push({
            id: id++,
            key: "❤",
        });
        queue.push({
            id: id++,
            key: "💯",
        });
        queue.push({
            id: id++,
            key: "😳",
        });
        queue.push({
            id: id++,
            key: "🎉",
        });
        queue.push({
            id: id++,
            key: "😄",
        });
    });

    function spawnReaction() {
        let item = queue.shift();
        if (item) {
            const reaction = item;
            reactions.update((map) => {
                map.set(reaction.id, reaction);
                return map;
            });
        }
    }

    let task: any | undefined;

    function update() {
        spawnReaction();
        while (1000 / queue.length < 10) {
            spawnReaction();
        }
        task = setTimeout(() => update(), 1000 / queue.length);
    }
    
    onMount(() => {
        update();
        return () => {
            clearTimeout(task);
        }
    });

    client.run();
</script>

<main>
    {#each $reactions.values() as reaction (reaction.id)}
        <ReactionEntry {reaction} />
    {/each}
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: flex-end;
        width: 100%;
        height: 100%;
        padding: 10px;
        overflow: hidden;
    }
</style>