// types/certs.ts
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
