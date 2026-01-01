import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {Components} from "react-markdown";
import type {Message} from "@/lib/types";
import {ProjectsCarousel} from "@/features/projects/components/projects-carousel";
import {projects} from "@/features/projects/data/projects";
import {SkillsGrid} from "@/features/skills/skills-grid";
import {ResumeEmbed} from "@/features/resume/components/resume-embed";

// --- Markdown Styles ---
// Defined outside the component to prevent re-creation on every render.
const markdownComponents: Components = {
    p: ({node, ...props}) => (
        <p {...props} className="mb-5 leading-7 text-zinc-200 block last:mb-0"/>
    ),
    strong: ({node, ...props}) => (
        <strong {...props} className="font-bold text-white"/>
    ),
    ul: ({node, ...props}) => (
        <ul {...props} className="list-disc list-outside ml-5 mb-4 space-y-2 marker:text-zinc-400"/>
    ),
    ol: ({node, ...props}) => (
        <ol {...props} className="list-decimal pl-6 mb-5 space-y-2 marker:text-zinc-200"/>
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
        <h3 {...props} className="text-lg font-bold text-white mt-5 mb-2 tracking-tight"/>
    ),
};

interface ChatBubbleProps {
    message: Message;
}

// React.memo is used here to prevent unnecessary re-renders of old messages
// when the chat history updates.
export const ChatBubble = React.memo(({message}: ChatBubbleProps) => {
    const isUser = message.role === "user";

    // Render User Message
    if (isUser) {
        return (
            <div
                className="flex w-full justify-end mb-2 md:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div
                    className="max-w-[80%] md:max-w-[95%] rounded-3xl px-5 py-3 shadow-sm bg-chat-user-bg text-chat-user-fg border border-gray-100 dark:border-zinc-800">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </div>
        );
    }

    // Render Special UI Components (Projects, Skills, Resume)
    // This handles the "Visual Portfolio" features triggered by the sidebar.
    if (message.uiComponent) {
        let ComponentToRender = null;

        switch (message.uiComponent) {
            case "projects":
                ComponentToRender = <ProjectsCarousel items={projects} autoRotate={true}/>;
                break;
            case "skills":
                ComponentToRender = <SkillsGrid/>;
                break;
            case "resume":
                ComponentToRender = <ResumeEmbed/>;
                break;
        }

        if (ComponentToRender) {
            return (
                <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col items-center justify-center">
                        {ComponentToRender}
                    </div>
                </div>
            );
        }
    }

    // Render AI Text Message (Markdown)
    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-start mb-4">
                <div className="max-w-[90%] md:max-w-[95%] px-4 md:px-5 text-chat-bot-fg">
                    <div
                        className="prose prose-sm md:prose-base max-w-none dark:prose-invert leading-7 tracking-wide font-light">
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