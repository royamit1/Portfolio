"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {ArrowUpRight} from "lucide-react"

interface TopicButtonProps {
    label: string
    Icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    animationDelay: number
    disabled?: boolean
}

export function TopicButton({label, Icon, onClick, animationDelay, disabled}: TopicButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant="ghost"
            className={cn(
                "group w-full justify-start gap-3 md:gap-4 text-sidebar-foreground transition-all duration-300 group relative overflow-hidden rounded-xl py-4 md:py-6 animate-slide-in-left",
                !disabled && "hover:bg-topic-button-accent/90 hover:text-topic-button-accent-foreground active:bg-topic-button-accent/80 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:translate-x-2",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
            }}
        >
            {!disabled && (
                <>
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-topic-button-accent/0 via-topic-button-accent/0 to-topic-button-accent/0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-active:translate-x-[100%] transform"
                        style={{transition: "transform 0.8s ease-out, opacity 0.3s ease-out"}}
                    />
                    <div
                        className="absolute inset-0 bg-topic-button-accent/10 rounded-xl opacity-0 group-hover:opacity-100 group-active:opacity-100 blur-sm transition-opacity duration-300"/>
                </>
            )}

            <div className="relative z-10 flex items-center gap-3 md:gap-4 w-full">
                <div
                    className={cn(
                        "p-2 md:p-2.5 rounded-lg bg-topic-button-accent/10 transition-all duration-300",
                        !disabled && "group-hover:bg-topic-button-accent/20 group-active:bg-topic-button-accent/20 group-hover:scale-110 group-hover:rotate-6"
                    )}>
                    <Icon className="h-4 w-4 md:h-5 md:w-5 text-indigo-400 transition-all duration-300"/>
                </div>
                <span className="font-medium text-sm md:text-base">{label}</span>
                <ArrowUpRight className="ml-auto w-4 h-4 opacity-50 md:opacity-0 md:group-hover:opacity-50 transition-opacity"/>            </div>
        </Button>
    )
}