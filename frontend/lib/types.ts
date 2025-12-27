export type Topic = "projects" | "skills" | "resume";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isComplete?: boolean;
    // New field to support rendering custom UI components within the message stream
    uiComponent?: Topic;
}

export interface ToolLog {
    tool: string;
    message: string;
    status: "loading" | "success" | "error";
}
