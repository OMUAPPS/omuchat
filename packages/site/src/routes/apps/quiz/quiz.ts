export type QuestionOption = {
    key: string;
    text: string;
    correct: boolean;
};

export type Question = {
    text: string;
    options: QuestionOption[];
    shuffle: boolean;
};

export type QuizData = {
    title: string;
    questions: Question[];
    sort: 'time' | 'score';
};

export type Quiz = {
    id: string;
    data: QuizData;
};
