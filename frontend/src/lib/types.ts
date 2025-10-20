export type Topic = "projects" | "skills" | "resume"

export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    showProjectCards?: boolean
    showSkillsGrid?: boolean
    showResume?: boolean
}
