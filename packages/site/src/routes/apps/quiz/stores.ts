import { writable, type Readable } from 'svelte/store';
import { client } from './client.js';
import type { Registry } from '@omuchatjs/omu/extension/registry/registry.js';
import type { Quiz, QuizData } from './quiz.js';
import type { GameData } from './game/game.js';

export type ScreenType = 'connecting' | 'create' | 'game';
export const screen = writable<ScreenType | null>('connecting');

function wrapRegistry<T>(registry: Registry<T>): Readable<T> {
    const { subscribe, set } = writable<T>();
    registry.listen((value) => {
        console.log('registry updated', value);
        set(value);
    });
    return { subscribe };
}

export const GAME_DATA = client.omu.registry.get<GameData | null>({ name: 'game' }, null);
export const gameData = wrapRegistry(GAME_DATA);

type Quizzes = Record<string, QuizData>;
const QUIZZES = client.omu.registry.get<Quizzes>({ name: 'quizzes' }, {});
export const quizzes = wrapRegistry(QUIZZES);

export async function getQuizzes() {
    return await QUIZZES.get();
}

export const createQuiz = async (data: QuizData) => {
    const id = Date.now().toString();
    await QUIZZES.update((registry) => {
        registry = registry || { quiz: {} };
        registry[id] = data;
        return registry;
    });
    return {
        id,
        data,
    };
};

export const deleteQuiz = async (id: string) => {
    await QUIZZES.update((registry) => {
        delete registry[id];
        return registry;
    });
};

export const updateQuiz = async (quiz: Quiz) => {
    await QUIZZES.update((registry) => {
        registry[quiz.id] = quiz.data;
        return registry;
    });
};
