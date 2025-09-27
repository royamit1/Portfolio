// types/project.ts
export interface Project {
    title: string;
    description: string;
    tech?: string[];
    github: string;
    demo?: string;
    language?: string;
    contribution?: boolean;
    imageUrl?: string;
    technologies?: string[];
}