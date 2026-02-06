export type Topic = "projects" | "skills" | "resume";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isComplete?: boolean;
    uiComponent?: Topic;     // For rendering visual components
    template?: string;       // For rich template responses
}

export interface ToolLog {
    tool: string;
    message: string;
    status: "loading" | "success" | "error";
}
