"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"

interface TopicButtonProps {
    label: string
    Icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    animationDelay: number
}

export function TopicButton({label, Icon, onClick, animationDelay}: TopicButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="ghost"
            className="group w-full justify-start gap-4 text-sidebar-foreground hover:bg-topic-button-accent/90 hover:text-topic-button-accent-foreground active:bg-topic-button-accent/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:translate-x-2 group relative overflow-hidden rounded-xl py-6 animate-slide-in-left"
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
            }}
        >
            <div
                className="absolute inset-0 bg-gradient-to-r from-topic-button-accent/0 via-topic-button-accent/0 to-topic-button-accent/0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-active:translate-x-[100%] transform"
                style={{transition: "transform 0.8s ease-out, opacity 0.3s ease-out"}}
            />

            <div
                className="absolute inset-0 bg-topic-button-accent/10 rounded-xl opacity-0 group-hover:opacity-100 group-active:opacity-100 blur-sm transition-opacity duration-300"/>

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div
                    className="p-2 rounded-lg bg-topic-button-accent/10 group-hover:bg-topic-button-accent/20 group-active:bg-topic-button-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-110 group-active:rotate-6">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-all duration-300"/>
                </div>
                <span className="font-medium text-base">{label}</span>
            </div>
        </Button>
    )
}