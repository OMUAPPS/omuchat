import { get } from 'svelte/store';
import type { Quiz, QuizData } from '../quiz.js';
import { GAME_DATA, gameData } from '../stores.js';
import { client } from '../client.js';
import { events } from '@omuchatjs/chat';
import type { AuthorJson } from '@omuchatjs/chat/models/author.js';
import { browser } from '$app/environment';

export interface GameData {
    id: string;
    data: QuizData;
    currentQuestion: number;
    times: Record<
        number,
        {
            start: number;
            end: number;
        }
    >;
    players: Record<
        string,
        {
            author: AuthorJson;
            answers: Record<number, Record<number, number>>;
        }
    >;
    status: 'waiting' | 'playing' | 'finished';
}

export async function createGame(quiz: Quiz) {
    if (get(gameData)) {
        throw new Error('Game already started');
    }
    await GAME_DATA.update(() => ({
        id: quiz.id,
        data: quiz.data,
        currentQuestion: 0,
        times: {},
        players: {},
        status: 'waiting',
    }));
}

export async function updateGame(fn: (data: GameData) => GameData) {
    if (!get(gameData)) {
        throw new Error('Game not started');
    }
    await GAME_DATA.update((data) => {
        return fn(data!);
    });
}

export async function endGame() {
    await GAME_DATA.update(() => null);
}

import se01 from '../se/se01.mp3';
let se01audio: HTMLAudioElement;
if (browser) {
    se01audio = new Audio(se01);
}

export function next() {
    const game = get(gameData);
    if (!game) {
        throw new Error('Game not started');
    }
    if (game.currentQuestion < game.data.questions.length - 1) {
        se01audio.play();
        const time = new Date().getTime();
        updateGame((game) => ({
            ...game,
            times: {
                ...game.times,
                [game.currentQuestion]: {
                    ...game.times[game.currentQuestion],
                    end: time,
                },
                [game.currentQuestion + 1]: {
                    start: time,
                    end: 0,
                },
            },
            currentQuestion: game.currentQuestion + 1,
        }));
    } else {
        updateGame((game) => ({
            ...game,
            times: {
                ...game.times,
                [game.currentQuestion]: {
                    ...game.times[game.currentQuestion],
                    end: new Date().getTime(),
                },
            },
            status: 'finished',
        }));
    }
}

client.on(events.MessageCreate, async (message) => {
    if (!message.authorId) {
        return;
    }
    const authorId = message.authorId;
    if (!authorId) {
        return;
    }
    const game = get(gameData);
    if (!game) {
        return;
    }
    if (game.status !== 'playing') {
        return;
    }
    const question = game.data.questions[game.currentQuestion];
    if (game.players[authorId]?.answers[game.currentQuestion]) {
        return;
    }
    const answers = {} as { [key: number]: number };
    const answered = question.options.some((option, index) => {
        if (message.text.toLowerCase() === option.key.toLowerCase()) {
            answers[index] = message.createdAt.getTime();
            return true;
        }
    });
    if (!answered) {
        return;
    }
    const author = await client.authors.get(authorId);
    if (!author) {
        return;
    }
    await updateGame((data) => {
        data.players[authorId] = {
            author: author.toJson(),
            answers: {
                ...data.players[authorId]?.answers,
                [game.currentQuestion]: answers,
            },
        };
        return data;
    });
});
