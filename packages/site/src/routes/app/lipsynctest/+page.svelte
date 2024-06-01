<script lang="ts">
    import { BROWSER } from 'esm-env';
    import { LINE_FRAGMENT_SHADER, LIVE_VERTEX_SHADER } from './shader.js';
    import { GlContext } from './glcontext.js';
    import { onMount } from 'svelte';
    import { data } from './vowels.js';

    let canvas: HTMLCanvasElement;
    let requestId: number | null = null;
    let glContext: GlContext;
    let gl: WebGL2RenderingContext;
    let width: number;
    let height: number;

    $: if (canvas) {
        glContext = GlContext.create(canvas);
        gl = glContext.gl;
    }

    let timeDomainArray: Float32Array;
    let frequencyArray: Float32Array;
    let vowels: {
        [key: string]: Float32Array | null;
    } = {
        a: new Float32Array(data.a),
        i: new Float32Array(data.i),
        u: new Float32Array(data.u),
        e: new Float32Array(data.e),
        o: new Float32Array(data.o),
        n: new Float32Array(data.n),
    };
    let vowelDotProduct: { [key: string]: number } = {};
    let loudness: number;

    function normalize(a: Float32Array) {
        const magnitude = Math.sqrt(a.reduce((acc, x) => acc + x * x, 0));
        return a.map((x) => x / magnitude);
    }

    function dotProduct(a: Float32Array, b: Float32Array) {
        return a.reduce((acc, x, i) => acc + x * b[i], 0);
    }

    function updateVowelDotProduct(frequencyArray: Float32Array) {
        const normalized = normalize(frequencyArray);
        for (const [key, value] of Object.entries(vowels)) {
            if (value) {
                vowelDotProduct[key] = dotProduct(normalized, normalize(value));
            } else {
                vowelDotProduct[key] = 0;
            }
        }
    }

    let highestVowel = { key: '', value: 0 };
    let vowelScores: { key: string; value: number }[] = [];

    $: {
        const scores = Object.entries(vowelDotProduct)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => b.value - a.value);
        const loudScore = 1 - 1 / (loudness + 1);
        if (scores.length !== 0) {
            {
                const max = scores[0].value;
                const min = scores[scores.length - 1].value;
                scores.forEach((score) => {
                    score.value = ((score.value - min) / (max - min)) * loudScore;
                });
            }
            if (scores.length >= 3) {
                const max = scores[0].value;
                const min = scores[2].value;
                scores.forEach((score) => {
                    score.value = Math.max(0, ((score.value - min) / (max - min)) * loudScore);
                });
            }
            const highest = scores[0];
            highestVowel = highest;
            vowelScores = scores;
        }
    }

    async function init() {
        const audioCtx = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const input = audioCtx.createMediaStreamSource(stream);
        const analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = Math.pow(2, 10);
        analyzer.smoothingTimeConstant = 0.8;
        input.connect(analyzer);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const program = glContext.createProgram([
            glContext.createShader(LIVE_VERTEX_SHADER),
            glContext.createShader(LINE_FRAGMENT_SHADER),
        ]);

        timeDomainArray = new Float32Array(analyzer.fftSize);
        frequencyArray = new Float32Array(analyzer.frequencyBinCount);
        const timeDomainVbo = glContext.createBuffer();
        const frequencyVbo = glContext.createBuffer();
        timeDomainVbo.bind(() => {
            timeDomainVbo.setData(timeDomainArray, 'dynamic');
        });
        frequencyVbo.bind(() => {
            frequencyVbo.setData(frequencyArray, 'dynamic');
        });

        const render = () => {
            program.use(() => {
                const u_length = program.getUniform('u_length');
                const u_minValue = program.getUniform('u_minValue');
                const u_maxValue = program.getUniform('u_maxValue');
                const u_color = program.getUniform('u_color');
                u_length.set1f(timeDomainArray.length);
                u_minValue.set1f(-1.0);
                u_maxValue.set1f(1.0);
                u_color.set3f(1.0, 0.0, 0.0);

                analyzer.getFloatTimeDomainData(timeDomainArray);
                timeDomainVbo.bind(() => {
                    timeDomainVbo.setSubData(timeDomainArray, 0);
                    gl.enableVertexAttribArray(0);
                    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_STRIP, 0, timeDomainArray.length);
                });

                u_length.set1f(frequencyArray.length);
                u_minValue.set1f(analyzer.minDecibels);
                u_maxValue.set1f(analyzer.maxDecibels);
                u_color.set3f(0.0, 0.0, 1.0);

                analyzer.getFloatFrequencyData(frequencyArray);
                frequencyVbo.bind(() => {
                    frequencyVbo.setSubData(frequencyArray, 0);
                    gl.enableVertexAttribArray(0);
                    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_STRIP, 0, frequencyArray.length);
                });
            });

            loudness = timeDomainArray.reduce((acc, x) => acc + x * x, 0);
            updateVowelDotProduct(frequencyArray);

            requestId = requestAnimationFrame(render);
        };

        requestId = requestAnimationFrame(render);
    }

    function resize() {
        if (requestId != null) {
            cancelAnimationFrame(requestId);
        }
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        requestId = requestAnimationFrame(render);
    }

    function copyToClipboard() {
        const data = JSON.stringify(
            Object.fromEntries(
                Object.entries(vowels).map(([key, value]) => [key, Array.from(value!)]),
            ),
        );
        navigator.clipboard.writeText(data);
    }

    if (BROWSER) {
        onMount(() => {
            init();
            resize();
        });
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<canvas
    bind:this={canvas}
    {width}
    {height}
    bind:clientWidth={width}
    bind:clientHeight={height}
    on:resize={resize}
/>
{#each Object.entries(vowelDotProduct) as [key, value]}
    <div>
        <button
            on:click={() => {
                vowels[key] = frequencyArray.slice();
            }}
        >
            set
        </button>
        {key}: {vowelScores.find((v) => v.key === key)?.value.toFixed(2)}
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={vowelScores.find((v) => v.key === key)?.value}
        />
    </div>
{/each}
{#if highestVowel.value > 0.5}
    <div class="highest">
        {highestVowel.key}
    </div>
{/if}
<div>loudness: {loudness}</div>
<button on:click={copyToClipboard}>copy</button>

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
    }

    .highest {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
    }
</style>
