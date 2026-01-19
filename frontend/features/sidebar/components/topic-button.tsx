"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { useChatContext } from "@/features/chat/context/chat-context";

interface TopicButtonProps {
    id?: string;
    label: string
    Icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    animationDelay: number
    disabled?: boolean
}

export function TopicButton({ id, label, Icon, onClick, animationDelay, disabled }: TopicButtonProps) {
    const { tourStep } = useChatContext();

    return (
        <Button
            id={id}
            onClick={onClick}
            disabled={disabled}
            variant="ghost"
            className={cn(
                "group relative w-full justify-start gap-2 md:gap-4",
                "rounded-lg md:rounded-xl py-5 md:py-7",
                "transition-all duration-300 ease-out",

                "bg-transparent text-zinc-300",
                !disabled && "hover:bg-zinc-800/50 hover:pl-4 md:hover:pl-5 hover:text-zinc-200",

                // Disabled State
                disabled && "opacity-50 cursor-not-allowed",

                // Tour Spotlight
                tourStep?.targetId === id && "spotlight-active z-50 bg-zinc-800/50 pl-4 md:pl-5"
            )}
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
            }}
        >
            {/* Active Indicator (Left Border) */}
            <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 h-6 md:h-10 w-0.5 md:w-1 rounded-r-full bg-indigo-500",
                "opacity-0 transition-all duration-300 scale-y-0",
                !disabled && "group-hover:opacity-100 group-hover:scale-y-100",
                tourStep?.targetId === id && "opacity-100 scale-y-100"
            )} />

            <div className="relative z-10 flex items-center gap-3 md:gap-4 w-full">
                {/* Icon Box */}
                <div className={cn(
                    "p-1.5 md:p-2.5 rounded-md md:rounded-lg transition-all duration-300",
                    "bg-indigo-500/10 border border-indigo-500/20",
                    !disabled && "group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 group-hover:rotate-3",
                    tourStep?.targetId === id && "bg-indigo-500/20 border-indigo-500/40 scale-110 rotate-3"
                )}>
                    <Icon className={cn(
                        "h-4 w-4 md:h-6 md:w-6 transition-colors",
                        "text-indigo-400",
                        !disabled && "group-hover:text-indigo-300",
                        tourStep?.targetId === id && "text-indigo-300"
                    )} />
                </div>

                {/* Label */}
                <span className="font-medium text-sm md:text-lg">
                    {label}
                </span>

                {/* Arrow Hint */}
                <ArrowUpRight className={cn(
                    "ml-auto w-3.5 h-3.5 md:w-5 md:h-5 text-zinc-600 transition-all duration-300",
                    "opacity-0 -translate-x-2",
                    !disabled && "group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-400",
                    tourStep?.targetId === id && "opacity-100 translate-x-0 text-indigo-400"
                )} />
            </div>
        </Button>
    )
}