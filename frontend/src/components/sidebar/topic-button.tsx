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
            className="group w-full justify-start gap-4 text-sidebar-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:translate-x-2 group relative overflow-hidden rounded-xl py-6 animate-slide-in-left"
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
            }}
        >
            <div
                className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/0 via-sidebar-accent/0 to-sidebar-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] transform"
                style={{transition: "transform 0.8s ease-out, opacity 0.3s ease-out"}}
            />

            <div
                className="absolute inset-0 bg-sidebar-accent/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"/>

            <div className="relative z-10 flex items-center gap-4 w-full">
                <div
                    className="p-2 rounded-lg bg-sidebar-accent/10 group-hover:bg-sidebar-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-all duration-300"/>
                </div>
                <span className="font-medium text-base">{label}</span>
            </div>
        </Button>
    )
}