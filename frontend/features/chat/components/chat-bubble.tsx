import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Components} from "react-markdown";
import type {Message} from "@/lib/types";

interface ChatBubbleProps {
    message: Message;
}

export const ChatBubble = React.memo(({message}: ChatBubbleProps) => {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex w-full justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div
                    className="max-w-[80%] md:max-w-[70%] rounded-3xl px-5 py-3 shadow-sm bg-chat-user-bg text-chat-user-fg border border-gray-100 dark:border-zinc-800">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </div>
        );
    }

    const markdownComponents: Components = {
        p: ({node, ...props}) => (
            <p {...props} className="mb-4 last:mb-0 text-zinc-200"/>
        ),
        strong: ({node, ...props}) => (
            <strong {...props} className="font-semibold text-white"/>
        ),
        ul: ({node, ...props}) => (
            <ul {...props} className="list-disc list-outside ml-5 mb-4 space-y-2 marker:text-zinc-400"/>
        ),
        li: ({node, ...props}) => (
            <li {...props} className="pl-1 text-zinc-200"/>
        ),
        a: ({node, ...props}) => (
            <a {...props}
               className="text-indigo-400 hover:text-indigo-300 hover:underline decoration-indigo-400/30 font-medium transition-colors"
               target="_blank" rel="noopener noreferrer"/>
        ),
        h3: ({node, ...props}) => (
            <h3 {...props} className="text-lg font-bold text-white mt-6 mb-3 tracking-tight"/>
        ),
    };

    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-start mb-4">
                <div className="max-w-[90%] md:max-w-[85%] px-4 md:px-5 text-chat-bot-fg">
                    <div className="
                        prose prose-sm md:prose-base max-w-none dark:prose-invert
                        leading-7 tracking-wide font-light">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
});

ChatBubble.displayName = "ChatBubble";