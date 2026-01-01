import React from "react";
import {Code2, Briefcase, FileText, Send} from "lucide-react"

export interface Command {
    value: string
    label: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}

export const COMMANDS: Command[] = [
    {
        value: "/projects",
        label: "Projects",
        description: "Showcase my featured projects",
        icon: Code2,
    },
    {
        value: "/skills",
        label: "Skills",
        description: "List my technical skills",
        icon: Briefcase,
    },
    {
        value: "/resume",
        label: "Resume",
        description: "View my interactive resume",
        icon: FileText,
    },
    {
        value: "/contact",
        label: "Contact",
        description: "Open the contact form",
        icon: Send,
    },
]
