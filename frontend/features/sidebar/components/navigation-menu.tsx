"use client"

import * as React from "react"
import type {Topic} from "@/lib/types"
import {TopicButton} from "./topic-button"
import {useChatContext} from "@/features/chat/context/chat-context"

interface TopicItem {
    readonly id: Topic
    readonly label: string
    readonly icon: React.ComponentType<{ className?: string }>
}

interface NavigationMenuProps {
    readonly topics: readonly TopicItem[]
}

export function NavigationMenu({topics}: NavigationMenuProps) {
    const {onTopicSelect, isLoading} = useChatContext();

    return (
        <nav className="relative z-10 flex-1 space-y-3 pl-3 pr-8">
            <p className="text-xs font-bold text-sidebar-foreground/85 mb-5 uppercase tracking-widest flex items-center gap-2">
                <span className="h-px w-3 bg-indigo-500/50" /> {/* Added color to line */}
                Visual Portfolio
            </p>
            {topics.map(({id, label, icon: Icon}, index) => (
                <TopicButton
                    key={id}
                    label={label}
                    Icon={Icon}
                    onClick={() => onTopicSelect(id)}
                    animationDelay={index * 100}
                    disabled={isLoading}
                />
            ))}
        </nav>
    )
}
