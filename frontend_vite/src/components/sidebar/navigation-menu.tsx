"use client"

import * as React from "react"
import type {Topic} from "@/lib/types"
import {TopicButton} from "@/components/sidebar/topic-button"

interface TopicItem {
    readonly id: Topic
    readonly label: string
    readonly icon: React.ComponentType<{ className?: string }>
}

interface NavigationMenuProps {
    readonly topics: readonly TopicItem[]
    onTopicSelect: (topic: Topic) => void
}

export function NavigationMenu({topics, onTopicSelect}: NavigationMenuProps) {
    return (
        <nav className="relative z-10 flex-1 space-y-3 pl-3 pr-8">
            <p className="text-xs font-bold text-sidebar-foreground/50 mb-5 uppercase tracking-widest flex items-center gap-2">
                <span className="h-px w-3"/>
                Quick Access
            </p>
            {topics.map(({id, label, icon: Icon}, index) => (
                <TopicButton
                    key={id}
                    label={label}
                    Icon={Icon}
                    onClick={() => onTopicSelect(id)}
                    animationDelay={index * 100}
                />
            ))}
        </nav>
    )
}