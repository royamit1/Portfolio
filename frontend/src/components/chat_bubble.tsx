import type React from "react"
import {cn} from "@/lib/utils"
import type {Message} from "@/lib/types"
import {ProjectCards} from "@/components/project_cards"

interface ChatBubbleProps {
    message: Message
    style?: React.CSSProperties
}

export function ChatBubble({message, style}: ChatBubbleProps) {
    const isUser = message.role === "user"

    if (message.showProjectCards && !isUser) {
        return (
            <div className="flex justify-evenly" style={style}>
                <div className="w-full max-w-[90%]">
                    <p className="text-[16px] leading-relaxed whitespace-pre-wrap text-chat-bot-fg mb-4">{message.content}</p>
                    <ProjectCards/>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")} style={style}>
            {isUser ? (
                <div
                    className="max-w-[60%] rounded-3xl rounded-br-md bg-chat-user-bg px-4 py-2 shadow-md text-chat-user-fg"
                >
                    <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
            ) : (
                <div className="max-w-full rounded-3xl bg-chat-bot-bg px-5 py-3 text-chat-bot-fg">
                    <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
            )}
        </div>
    )
}
