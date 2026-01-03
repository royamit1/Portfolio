"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {ArrowUpRight} from "lucide-react"
import {useChatContext} from "@/features/chat/context/chat-context";

interface TopicButtonProps {
    id?: string;
    label: string
    Icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    animationDelay: number
    disabled?: boolean
}

export function TopicButton({id, label, Icon, onClick, animationDelay, disabled}: TopicButtonProps) {
    const {tourStep} = useChatContext();
    
    return (
        <Button
            id={id}
            onClick={onClick}
            disabled={disabled}
            variant="ghost"
            className={cn(
                "group relative w-full justify-start gap-3 md:gap-4",
                "rounded-xl py-4 md:py-6",
                "transition-all duration-300 ease-out",

                "bg-transparent text-zinc-400",
                !disabled && "hover:bg-zinc-800 hover:text-white hover:pl-5",

                // Disabled State
                disabled && "opacity-50 cursor-not-allowed",
                
                // Tour Spotlight
                tourStep?.targetId === id && "spotlight-active z-50 bg-zinc-800 text-white pl-5"
            )}
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
            }}
        >
            {/* Active Indicator (Left Border) */}
            <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-indigo-500",
                "opacity-0 transition-all duration-300 scale-y-0",
                !disabled && "group-hover:opacity-100 group-hover:scale-y-100",
                tourStep?.targetId === id && "opacity-100 scale-y-100"
            )}/>

            <div className="relative z-10 flex items-center gap-3 md:gap-4 w-full">
                {/* Icon Box */}
                <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    "bg-white/5 group-hover:bg-indigo-500/10",
                    !disabled && "group-hover:scale-110 group-hover:rotate-3",
                    tourStep?.targetId === id && "bg-indigo-500/10 scale-110 rotate-3"
                )}>
                    <Icon className={cn(
                        "h-4 w-4 md:h-5 md:w-5 transition-colors",
                        "text-zinc-500 group-hover:text-indigo-400",
                        tourStep?.targetId === id && "text-indigo-400"
                    )}/>
                </div>

                {/* Label */}
                <span className="font-medium text-sm md:text-base">
                    {label}
                </span>

                {/* Arrow Hint */}
                <ArrowUpRight className={cn(
                    "ml-auto w-4 h-4 text-zinc-600 transition-all duration-300",
                    "opacity-0 -translate-x-2",
                    !disabled && "group-hover:opacity-100 group-hover:translate-x-0",
                    tourStep?.targetId === id && "opacity-100 translate-x-0"
                )}/>
            </div>
        </Button>
    )
}