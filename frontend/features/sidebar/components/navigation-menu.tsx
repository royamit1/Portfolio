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
        <nav className="relative z-10 flex-1 space-y-2 px-4 md:px-5 py-6">
            <p className="text-[11px] font-bold text-zinc-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="h-px w-3 bg-indigo-500/50"/>
                Visual Portfolio
            </p>

            <div className="space-y-1">
                {topics.map(({id, label, icon: Icon}, index) => (
                    <TopicButton
                        key={id}
                        id={`tour-topic-${id}`}
                        label={label}
                        Icon={Icon}
                        onClick={() => onTopicSelect(id)}
                        animationDelay={index * 100}
                        disabled={isLoading}
                    />
                ))}
            </div>
        </nav>
    )
}