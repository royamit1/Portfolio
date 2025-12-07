import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Message} from "@/lib/types";

interface ChatBubbleProps {
    message: Message;
}

export const ChatBubble = React.memo(({message}: ChatBubbleProps) => {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex w-full justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-w-[80%] md:max-w-[70%] rounded-3xl px-5 py-3 shadow-sm bg-chat-user-bg text-chat-user-fg border border-gray-100 dark:border-zinc-800">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="max-w-[90%] md:max-w-[95%] px-4 md:px-5 text-chat-bot-fg">
                    <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert leading-relaxed text-gray-800 dark:text-gray-200">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom styling to match your 'clean' preference
                                p: ({node, ...props}) => <p {...props} className="mb-3 last:mb-0" />,
                                ul: ({node, ...props}) => <ul {...props} className="list-disc list-outside ml-4 space-y-1 mb-3" />,
                                li: ({node, ...props}) => <li {...props} className="pl-1" />,
                                a: ({node, ...props}) => (
                                    <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer" />
                                )
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
        </div>
    );
});

ChatBubble.displayName = "ChatBubble";