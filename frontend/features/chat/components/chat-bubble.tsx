import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";
import { ProjectsCarousel } from "@/features/projects/components/projects-carousel";
import { projects } from "@/features/projects/data/projects";
import { SkillsGrid } from "@/features/skills/skills-grid";
import { ResumeEmbed } from "@/features/resume/components/resume-embed";
import { AboutMeTemplate, GetInTouchTemplate } from "./templates";

import { markdownComponents } from "@/features/chat/lib/markdown-styles";

interface ChatBubbleProps {
    message: Message;
}

// Memoized to prevent re-renders of old messages when chat history updates
export const ChatBubble = React.memo(({ message }: ChatBubbleProps) => {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div
                className="flex w-full justify-end mb-2 md:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div
                    className="max-w-[80%] md:max-w-[95%] rounded-3xl px-5 py-3 shadow-sm bg-chat-user-bg text-chat-user-fg border border-gray-100 dark:border-zinc-800">
                    <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </div>
        );
    }

    // Rich templates for option button responses
    if (message.template) {
        let TemplateComponent = null;

        switch (message.template) {
            case "AboutMeTemplate":
                TemplateComponent = <AboutMeTemplate message={message} />;
                break;
            case "GetInTouchTemplate":
                TemplateComponent = <GetInTouchTemplate message={message} />;
                break;
        }

        if (TemplateComponent) {
            return (
                <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {TemplateComponent}
                </div>
            );
        }
    }

    // Visual components (Projects, Skills, Resume)
    if (message.uiComponent) {
        let ComponentToRender = null;

        switch (message.uiComponent) {
            case "projects":
                ComponentToRender = <ProjectsCarousel items={projects} autoRotate={true} />;
                break;
            case "skills":
                ComponentToRender = <SkillsGrid />;
                break;
            case "resume":
                ComponentToRender = <ResumeEmbed />;
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

    // Standard AI text message
    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-start mb-4">
                <div className="max-w-[90%] md:max-w-[95%] px-4 md:px-5 text-chat-bot-fg">
                    <div
                        className="prose prose-base md:prose-lg max-w-none dark:prose-invert leading-7 tracking-wide font-light">
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