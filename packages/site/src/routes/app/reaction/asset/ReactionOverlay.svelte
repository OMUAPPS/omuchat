<script lang="ts">
    import { Client } from '@omuchatjs/chat';
    import { App } from '@omuchatjs/omu';
    import { setClient } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { onMount } from 'svelte';
    import { IDENTIFIER } from '../app.js';
    import { REACTION_MESSAGE_TYPE } from '../reaction.js';

    export let id: string;

    const app = new App(IDENTIFIER.join('asset', id), {
        version: '0.1.0',
    });
    export const client = new Client({
        app,
    });
    setClient(client);

    if (BROWSER) {
        client.start();
    }

    type Reaction = {
        text: string;
        position: [number, number];
        velocity: [number, number];
        opacity: number;
        rotation: number;
        age: number;
    };

    let reactionArray: Reaction[] = [];
    const spawnQueue: string[] = [];
    const MAX_REACTION_LIMIT = 100;

    const reactionMessage = client.message.get(REACTION_MESSAGE_TYPE);
    reactionMessage.listen((message) => {
        Object.entries(message.reactions).forEach(([text, count]) => {
            for (let i = 0; i < count; i++) {
                spawnQueue.push(text);
            }
            if (spawnQueue.length > MAX_REACTION_LIMIT) {
                spawnQueue.splice(0, spawnQueue.length - MAX_REACTION_LIMIT);
            }
        });
    });

    let canvas: HTMLCanvasElement;
    let width: number;
    let height: number;

    $: if (canvas) {
        resize();
    }

    function resize() {
        if (!canvas) {
            return;
        }

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    let previousTime = Date.now();

    function getSpawnRate() {
        if (spawnQueue.length === 0) {
            return 10;
        }
        return Math.min(10, 1 / spawnQueue.length);
    }

    function spawnReaction(text: string) {
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 300) + 300;
        const vx = Math.random() - 0.5;
        const vy = Math.random() - 0.5;

        reactionArray.push({
            text,
            position: [x, y],
            velocity: [vx, vy],
            opacity: 1,
            rotation: 0,
            age: 0,
        });
    }

    let prevSpawnTime = Date.now();

    function updateSpawn() {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - prevSpawnTime) / 1000;
        const spawnRate = getSpawnRate();

        if (elapsedTime > spawnRate) {
            prevSpawnTime = currentTime;

            const toSpawnCount = Math.min(Math.floor(elapsedTime / spawnRate), spawnQueue.length);
            for (let i = 0; i < toSpawnCount; i++) {
                spawnReaction(spawnQueue.shift()!);
            }
        }
    }

    function updatePosition() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - previousTime) / 20;
        previousTime = currentTime;

        const expandedScreenBound = {
            left: -100,
            top: -100,
            right: canvas.width + 100,
            bottom: canvas.height + 100,
        };

        reactionArray = reactionArray
            .map((reaction) => {
                const [vx, vy] = reaction.velocity;
                const [x, y] = reaction.position;

                let newVx = vx + Math.sin(reaction.age / 15) / 3;
                newVx *= 0.8;
                const newVy = -Math.pow(reaction.age, 0.2);
                const newX = x + newVx;
                const newY = y + newVy;

                return {
                    ...reaction,
                    position: [newX, newY],
                    velocity: [newVx, newVy],
                    opacity: Math.min(1, reaction.age / 10) - Math.max(0, (reaction.age - 50) / 50),
                    rotation: (Math.sin(reaction.age / 15 + 1) * 5 * Math.PI) / 180,
                    age: reaction.age + deltaTime,
                } satisfies Reaction;
            })
            .filter(({ position }) => {
                const [x, y] = position;
                return (
                    x >= expandedScreenBound.left &&
                    x <= expandedScreenBound.right &&
                    y >= expandedScreenBound.top &&
                    y <= expandedScreenBound.bottom
                );
            });
    }

    function draw() {
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = '30px "Noto Color Emoji"';
        reactionArray.forEach(({ text, position, opacity, rotation }) => {
            const [x, y] = position;

            if (opacity <= 0) {
                return;
            }

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }

    let drawHandle: number;

    onMount(() => {
        drawHandle = requestAnimationFrame(function drawLoop() {
            updateSpawn();
            updatePosition();
            draw();
            drawHandle = requestAnimationFrame(drawLoop);
        });

        return () => {
            cancelAnimationFrame(drawHandle);
        };
    });
</script>

<div class="hidden">😳😄❤🎉💯</div>

<svelte:window on:resize={resize} />
<canvas bind:this={canvas} bind:clientWidth={width} bind:clientHeight={height} />

<style lang="scss">
    // https://github.com/fontsource/fontsource/issues/588
    // @fontsource/noto-color-emojiがうまく動かないので、google fonts越しで直接読み込む
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

    canvas {
        width: 100%;
        height: 100%;
        background: var(--color-bg-1);
    }

    .hidden {
        font-family: 'Noto Color Emoji';
        font-size: 0;
    }
</style>
