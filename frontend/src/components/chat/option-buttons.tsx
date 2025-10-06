"use client"

import {Button} from "@/components/ui/button.tsx"
import {Code2, Briefcase, FileText, Sparkles, User, Lightbulb} from "lucide-react"
import type {Topic} from "@/lib/types.ts"

interface OptionButtonsProps {
    onSelect: (topic: Topic) => void
}

export function OptionButtons({onSelect}: OptionButtonsProps) {
    const options = [
        {
            topic: "projects" as Topic,
            label: "Can you tell me about your projects?",
            icon: Code2,
        },
        {
            topic: "skills" as Topic,
            label: "What skills do you have?",
            icon: Briefcase,
        },
        {
            topic: "resume" as Topic,
            label: "Show me your resume",
            icon: FileText,
        },
        {
            topic: "projects" as Topic,
            label: "What makes you unique as a developer?",
            icon: Sparkles,
        },
        {
            topic: "skills" as Topic,
            label: "What technologies do you work with?",
            icon: Lightbulb,
        },
        {
            topic: "resume" as Topic,
            label: "Tell me about your experience",
            icon: User,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {options.map(({topic, label, icon: Icon}, index) => (
                <Button
                    key={`${topic}-${index}`}
                    onClick={() => onSelect(topic)}
                    variant="outline"
                    className="gap-3 justify-start text-left h-auto py-4 px-5 hover:bg-accent/10 hover:border-accent/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group"
                >
                    <Icon
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors duration-300"/>
                    <span
                        className="text-sm font-medium text-foreground group-hover:text-foreground transition-colors duration-300">
            {label}
          </span>
                </Button>
            ))}
        </div>
    )
}
