export type Topic = "projects" | "skills" | "resume";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    showProjects?: boolean;
    isComplete?: boolean;
}

export interface ToolLog {
    tool: string;
    message: string;
    status: "loading" | "success" | "error";
}
