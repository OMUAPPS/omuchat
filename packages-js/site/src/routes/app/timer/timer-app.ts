import { makeRegistryWritable } from '$lib/helper.js';
import type { Omu } from '@omujs/omu';
import { RegistryType } from '@omujs/omu/extension/registry/index.js';
import type { Writable } from 'svelte/store';
import { IDENTIFIER } from './app.js';

export type TimerData = {
    startTime: number;
    stopTime: number;
    time: number;
    running: boolean;
};

export type TimerConfig = {
    format: string;
    style: {
        color: string;
        backgroundColor: string;
        backgroundOpacity: number;
        backgroundPadding: [number, number];
        fontSize: number;
        fontFamily: string;
    };
};

const TIMER_REGISTRY_TYPE = RegistryType.createJson<TimerData>(IDENTIFIER, {
    name: 'timer',
    defaultValue: {
        startTime: 0,
        stopTime: 0,
        time: 0,
        running: false,
    },
});

const TIMER_CONFIG_REGISTRY_TYPE = RegistryType.createJson<TimerConfig>(IDENTIFIER, {
    name: 'timer-config',
    defaultValue: {
        format: '{minutes}:{seconds}.{centiseconds}',
        style: {
            color: '#000000',
            backgroundColor: '#ffffff',
            backgroundOpacity: 0.5,
            backgroundPadding: [10, 5],
            fontSize: 32,
            fontFamily: 'Noto Sans JP',
        },
    },
});

export class TimerApp {
    public readonly data: Writable<TimerData>;
    public readonly config: Writable<TimerConfig>;

    constructor(omu: Omu) {
        this.data = makeRegistryWritable(omu.registry.get(TIMER_REGISTRY_TYPE));
        this.config = makeRegistryWritable(omu.registry.get(TIMER_CONFIG_REGISTRY_TYPE));
    }

    public toggle() {
        this.data.update((data) => {
            const currentTime = Date.now();
            if (data.running) {
                return {
                    ...data,
                    stopTime: currentTime,
                    running: false,
                    time: data.time + currentTime - data.startTime,
                };
            } else {
                return { ...data, startTime: currentTime, running: true };
            }
        });
    }

    public reset() {
        this.data.update((data) => {
            const currentTime = Date.now();
            return {
                ...data,
                startTime: currentTime,
                stopTime: currentTime,
                time: 0,
            };
        });
    }
}
