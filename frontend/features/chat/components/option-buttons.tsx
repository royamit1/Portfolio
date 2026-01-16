"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Code2, Briefcase, FileText, Sparkles, User, Lightbulb } from "lucide-react"

interface OptionButtonsProps {
    onSelect: (prompt: string) => void
}

interface OptionItem {
    label: string
    value: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

// Configuration for the buttons.
// The 'value' is the actual text sent to the chatbot to trigger a conversation.
const OPTIONS: OptionItem[] = [
    {
        label: "Tell me about yourself",
        value: "Tell me about yourself",
        icon: User
    },
    {
        label: "What makes you stand out?",
        value: "What makes you stand out?",
        icon: Sparkles
    },
    {
        label: "Walk me through your best project",
        value: "Walk me through your best project",
        icon: Code2
    },
    {
        label: "What's in your tech toolkit?",
        value: "What's in your tech toolkit?",
        icon: Briefcase
    },
    {
        label: "How do I get in touch?",
        value: "How do I get in touch?",
        icon: Lightbulb
    },
]

export function OptionButtons({ onSelect }: OptionButtonsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
            {OPTIONS.map(({ label, value, icon: Icon }, index) => (
                <Button
                    key={index}
                    onClick={() => onSelect(value)}
                    variant="outline"
                    className="gap-3 justify-start text-left h-auto py-3 px-4 md:py-4 md:px-5 hover:bg-accent/10 hover:border-accent/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group whitespace-normal"
                >
                    <Icon
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-indigo-400 transition-colors duration-300" />
                    <span
                        className="text-sm md:text-base font-light text-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
                        {label}
                    </span>
                </Button>
            ))}
        </div>
    )
}