<script lang="ts">
    import { onMount } from 'svelte';

    import { client, emojis, scale, type Reaction } from './reaction.js';

    interface ReactionMessage {
        room_id: string;
        reactions: Record<string, number>;
    }
    const queue: Reaction[] = [];
    let id = 0;
    client.omu.message.listen<ReactionMessage>(
        {
            name: 'youtube-reaction',
            app: 'omu.chat/provider'
        },
        (data) => {
            for (const [key, value] of Object.entries(data.reactions)) {
                for (let i = 0; i < value; i++) {
                    id++;
                    queue.push({
                        id,
                        key
                    });
                }
            }
        }
    );
    client.omu.message.listen(
        {
            name: 'test',
            app: 'omu.chat.apps/youtube-reaction'
        },
        () => {
            queue.push({
                id: id++,
                key: '❤'
            });
            queue.push({
                id: id++,
                key: '💯'
            });
            queue.push({
                id: id++,
                key: '😳'
            });
            queue.push({
                id: id++,
                key: '🎉'
            });
            queue.push({
                id: id++,
                key: '😄'
            });
        }
    );

    interface Particle {
        spawnTime: number;
        id: number;
        key: string;
        x: number;
        y: number;
        vx: number;
        vy: number;
        opacity: number;
        rotation: number;
    }

    let particles: Map<number, Particle> = new Map();

    let lastSpawnTime = 0;
    function spawnParticle() {
        let item = queue.shift();
        if (item) {
            const reaction = item;
            particles.set(reaction.id, {
                spawnTime: Date.now(),
                id: reaction.id,
                key: reaction.key,
                x: Math.random() * (width - 100 * scale),
                y: Math.random() * (height - 300 * scale) + 250 * scale,
                vx: Math.random() - 0.5,
                vy: 0,
                opacity: 0,
                rotation: 0
            });
        }
    }

    function updateQueue() {
        if (queue.length === 0) {
            return;
        }
        const queueLimit = 1000;
        if (queue.length > queueLimit) {
            queue.splice(0, queue.length - queueLimit);
        }
        const elapsed = Date.now() - lastSpawnTime;
        const delay = 1000 / queue.length;
        if (elapsed < delay) {
            return;
        }
        spawnParticle();
        while (1000 / queue.length < 10) {
            spawnParticle();
        }
        lastSpawnTime = Date.now();
    }

    let animationFrameHandle: number;

    function render() {
        animationFrameHandle = requestAnimationFrame(render);

        updateQueue();

        ctx.clearRect(0, 0, width, height);
        for (const particle of particles.values()) {
            const elapsed = (Date.now() - particle.spawnTime) / 16;
            particle.y -= Math.pow(elapsed, 0.2);
            particle.vx += Math.sin(elapsed / 15) / 3;
            particle.vx *= 0.8;
            particle.x += particle.vx;
            particle.opacity = Math.min(1, elapsed / 10) - Math.max(0, (elapsed - 50) / 50);
            particle.rotation = Math.sin(elapsed / 15 + 1) * 5;
            if (particle.opacity < 0) {
                particles.delete(particle.id);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation * Math.PI) / 180);
            ctx.scale(scale, scale);
            if (emojis.has(particle.key)) {
                const emoji = emojis.get(particle.key);
                if (emoji) {
                    const size = Math.min(64, emoji.height);
                    const ratio = emoji.width / emoji.height;
                    ctx.drawImage(emoji, -size / 2 * ratio, -size / 2, size * ratio, size);
                } else {
                    ctx.font = "32px 'Noto Color Emoji', 'Noto Sans JP', sans-serif";
                    ctx.fillText(particle.key, 0, 0);
                }
            } else {
                ctx.font = "32px 'Noto Color Emoji', 'Noto Sans JP', sans-serif";
                ctx.fillText(particle.key, 0, 0);
            }
            ctx.restore();
        }
    }

    function resize() {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
    }

    onMount(() => {
        animationFrameHandle = requestAnimationFrame(render);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animationFrameHandle);
            window.removeEventListener('resize', resize);
        };
    });

    client.run();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let width: number;
    let height: number;

    $: {
        if (canvas) {
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Failed to get canvas context');
            }
            ctx = context;
            width = canvas.width = canvas.clientWidth;
            height = canvas.height = canvas.clientHeight;
        }
    }

    let screenshotEnabled = false;
    let screenshotImage: string;
    function screenshot() {
        screenshotImage = canvas.toDataURL();
    }
</script>

<main>
    <canvas bind:this={canvas} />
    {#if screenshotEnabled}
        <button on:click={screenshot}>スクリーンショット</button>
        <img src={screenshotImage} alt="" />
    {/if}
    <div class="font">❤💯😳🎉😄</div>
</main>

<style lang="scss">
    @import 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
    @import 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap';

    main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: flex-end;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
    }

    canvas {
        width: 100%;
        height: 100%;
    }

    .font {
        position: fixed;
        top: 0;
        left: 0;
        font-family: 'Noto Color Emoji', 'Noto Sans JP', sans-serif;
        opacity: 0;
    }
</style>
