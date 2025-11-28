export type Topic = "projects" | "skills" | "resume"

export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    // These legacy flags depend on backend implementation.
    // Since the new backend streams text/markdown, we focus on content.
    showProjectCards?: boolean
    showSkillsGrid?: boolean
    showResume?: boolean
}

// [NEW] Track the agent's internal thought process
export interface ToolLog {
    tool: string;
    status: 'loading' | 'success' | 'error';
    message: string;
}