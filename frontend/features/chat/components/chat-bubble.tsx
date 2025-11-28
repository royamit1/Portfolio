import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {cn} from "@/lib/utils";
import type {Message} from "@/lib/types";
import {SkillsGrid} from "@/features/skills";
import {ProjectsView} from "@/features/projects";
import {ResumeCard} from "@/features/resume";

interface ChatBubbleProps {
    message: Message;
}

export const ChatBubble = React.memo(({message}: ChatBubbleProps) => {
    const isUser = message.role === "user";

    // 1. Handle Special Interactive Components
    if (!isUser) {
        if (message.showProjectCards) return <ProjectsView/>;
        if (message.showSkillsGrid) return <SkillsGrid/>;
        if (message.showResume) return <ResumeCard/>;
    }

    return (
        <div className={cn("flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "justify-end" : "justify-start"
        )}>
            {isUser ? (
                // --- USER MESSAGE STYLE ---
                // Keeps the bubble look with px-5
                <div
                    className="max-w-[80%] md:max-w-[70%] rounded-3xl px-5 py-3 shadow-sm bg-chat-user-bg text-chat-user-fg border border-gray-100 dark:border-zinc-800">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            ) : (
                // --- AGENT MESSAGE STYLE ---
                // [FIX] Changed px-1 to px-4 md:px-5 to match the User bubble's indentation
                // This makes the text line up visually, even without a background color.
                <div className="max-w-[90%] md:max-w-[85%] px-4 md:px-5 text-chat-bot-fg">
                    <div
                        className="prose prose-sm md:prose-base max-w-none dark:prose-invert leading-relaxed text-gray-800 dark:text-gray-200">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p {...props} className="mb-3 last:mb-0"/>,
                                ul: ({node, ...props}) => <ul {...props}
                                                              className="list-disc list-outside ml-4 space-y-1 mb-3"/>,
                                li: ({node, ...props}) => <li {...props} className="pl-1"/>,
                                a: ({node, ...props}) => <a {...props}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                            target="_blank"/>
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
});

ChatBubble.displayName = "ChatBubble";