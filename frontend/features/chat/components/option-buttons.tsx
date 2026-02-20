"use client"

import { Button } from "@/components/ui/button"
import { COMMANDS } from "@/features/command-palette/commands"

interface OptionButtonsProps {
    onSelect: (prompt: string) => void
}

export function OptionButtons({ onSelect }: OptionButtonsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
            {COMMANDS.map(({ label, value, icon: Icon }) => (
                <Button
                    key={value}
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
