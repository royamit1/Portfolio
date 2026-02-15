"use client"

import * as React from "react"
import type { Topic } from "@/lib/types"
import { TopicButton } from "./topic-button"
import { useChatContext } from "@/features/chat/context/chat-context"

interface TopicItem {
    readonly id: Topic
    readonly label: string
    readonly icon: React.ComponentType<{ className?: string }>
}

interface NavigationMenuProps {
    readonly topics: readonly TopicItem[]
}

export function NavigationMenu({ topics }: NavigationMenuProps) {
    const { onTopicSelect, isLoading } = useChatContext();

    return (
        <nav className="relative z-10 flex-1 space-y-2 xl:space-y-2 px-6 xl:px-5 py-6 xl:py-4">
            <div className="mb-4">
                <p className="text-sm xl:text-base font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2.5">
                    <span className="h-[2px] w-5 bg-gradient-to-r from-indigo-500 to-indigo-500/50 rounded-full" />
                    Visual Content
                </p>
            </div>

            <div className="space-y-1">
                {topics.map(({ id, label, icon: Icon }, index) => (
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