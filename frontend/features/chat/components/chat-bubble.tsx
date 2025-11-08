import React from "react"
import {cn} from "@/lib/utils"
import type {Message} from "@/lib/types"
import {SkillsGrid} from "@/features/skills"
import {ProjectsView} from "@/features/projects"
import {ResumeCard} from "@/features/resume"

interface ChatBubbleProps {
    message: Message
}

export const ChatBubble = React.memo(({message}: ChatBubbleProps) => {
    const isUser = message.role === "user"

    // Special content rendering for assistant messages
    if (!isUser) {
        if (message.showProjectCards) return <ProjectsView/>
        if (message.showSkillsGrid) return <SkillsGrid/>
        if (message.showResume) return <ResumeCard/>
    }

    const textContent = (
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
        </p>
    );

    return (
        <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
            {isUser ? (
                <div
                    className="max-w-[80%] md:max-w-[70%] rounded-3xl px-4 py-2 md:px-5 md:py-3 shadow-md bg-chat-user-bg text-chat-user-fg">
                    {textContent}
                </div>
            ) : (
                <div className="text-chat-bot-fg p-3">
                    {textContent}
                </div>
            )}
        </div>
    )
});

ChatBubble.displayName = "ChatBubble";
