import { BROWSER } from 'esm-env';
import { writable } from 'svelte/store';

export type ThrowData = {
    thrower: string;
};
export type ThrowManyData = {
    throwers: string[];
};

export type State =
    | { type: 'idle' }
    | ({ type: 'throw_start' } & ThrowData)
    | ({ type: 'throwing' } & ThrowData)
    | ({ type: 'catching' } & ThrowData)
    | ({ type: 'eating' } & ThrowData)
    | { type: 'idle_start' }
    | ({ type: 'throw_many' } & ThrowManyData)
    | ({ type: 'throw_many_hit' } & ThrowManyData);

export type StateType = State['type'];

export const frame = writable(0);

if (BROWSER) {
    let lastTime = 0;
    requestAnimationFrame(function loop() {
        const time = performance.now();
        frame.set(time - lastTime);
        lastTime = time;
        requestAnimationFrame(loop);
    });
}
