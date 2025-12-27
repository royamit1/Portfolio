"use client"

import {Button} from "@/components/ui/button"
import {Code2, Briefcase, FileText, Sparkles, User, Lightbulb} from "lucide-react"
import React from "react";

interface OptionButtonsProps {
    onSelect: (prompt: string) => void
}

interface OptionItem {
    label: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function OptionButtons({onSelect}: OptionButtonsProps) {
    const options: OptionItem[] = React.useMemo(() => [
        {label: "Can you tell me about your projects?", icon: Code2},
        {label: "What are your technical skills?", icon: Briefcase},
        {label: "Show me your resume", icon: FileText},
        {label: "What makes you unique as a developer?", icon: Sparkles},
        {label: "What technologies do you work with?", icon: Lightbulb},
        {label: "Tell me about your experience", icon: User},
    ], [])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {options.map(({label, icon: Icon}, index) => (
                <Button
                    key={index}
                    onClick={() => onSelect(label)}
                    variant="outline"
                    className="gap-3 justify-start text-left h-auto py-3 px-4 md:py-4 md:px-5 hover:bg-accent/10 hover:border-accent/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group whitespace-normal"
                >
                    <Icon
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-indigo-400 transition-colors duration-300"/>
                    <span
                        className="text-xs md:text-sm font-medium text-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
            {label}
          </span>
                </Button>
            ))}
        </div>
    )
}
