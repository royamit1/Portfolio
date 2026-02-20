import React from "react";
import { Code2, Briefcase, User, Sparkles, Lightbulb } from "lucide-react"

interface Command {
    value: string
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}

export const COMMANDS: Command[] = [
    {
        value: "Tell me about yourself",
        label: "Tell me about yourself",
        description: "Learn about my background and story",
        icon: User,
    },
    {
        value: "What makes you stand out?",
        label: "What makes you stand out?",
        description: "Discover my unique value proposition",
        icon: Sparkles,
    },
    {
        value: "Walk me through your best project",
        label: "Walk me through your best project",
        description: "Explore my featured work in detail",
        icon: Code2,
    },
    {
        value: "What's in your tech toolkit?",
        label: "What's in your tech toolkit?",
        description: "Discuss my technical skills and tools",
        icon: Briefcase,
    },
    {
        value: "How do I get in touch?",
        label: "How do I get in touch?",
        description: "Find out how to contact me",
        icon: Lightbulb,
    },
]

