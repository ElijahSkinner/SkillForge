// types/quiz.ts
export interface QuizQuestion {
    id: number;
    type: 'multiple-choice' | 'drag-drop' | 'true-false' | 'fill-blank' | 'scenario';
    question: string;
    options?: string[];
    correct: number | boolean | string[] | string;
    explanation: string;
    items?: Array<{ id: string; text: string }>;
    targets?: Array<{ id: string; text: string; correct: string }>;
    correctOrder?: string[];
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
}

export interface ObjectiveQuizzes {
    quizA: Quiz;
    quizB: Quiz;
}

// types/certs.ts - UPDATE YOUR EXISTING FILE
export type LessonType = {
    id: number;
    name: string;
};

export type ModuleType = {
    id: number;
    name: string;
    weight: number;
    completed: boolean;
    lessons: LessonType[];
};
