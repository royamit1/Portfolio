import type React from "react"
import {cn} from "@/lib/utils.ts"
import type {Message} from "@/lib/types.ts"
import {SkillsGrid} from "@/components/chat/skills-grid"
import ThreeDCarousel from "@/components/chat/projects-carousel.tsx"
import ResumeCard from "@/components/chat/resume-card"
import {projects} from "@/components/chat/projects"

interface ChatBubbleProps {
    message: Message
    style?: React.CSSProperties
}

export function ChatBubble({message, style}: ChatBubbleProps) {
    const isUser = message.role === "user"

    if (message.showProjectCards && !isUser) {
        return (
            <div className="flex justify-evenly" style={style}>
                <div className="max-w-full">
                    <ThreeDCarousel
                        items={projects}
                        autoRotate={true}
                        rotateInterval={4000}
                        cardHeight={500}
                        title="Project Showcase"
                        subtitle="Full-Stack Applications & Robust Engineering"
                        tagline="I've worked on various full-stack applications, from AI-powered chatbots to e-commerce
                        platforms. Each project showcases my ability to blend thoughtful design with robust engineering."
                    />
                </div>
            </div>
        )
    }

    if (message.showSkillsGrid && !isUser) {
        return (
            <div className="flex justify-evenly" style={style}>
                <div className="max-w-full">
                    <SkillsGrid/>
                </div>
            </div>
        )
    }

    if (message.showResume && !isUser) {
        return (
            <div className="flex justify-start" style={style}>
                <div className="max-w-full">
                    <ResumeCard/>
                </div>
            </div>
        )
    }


    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")} style={style}>
            {isUser ? (
                <div className="max-w-[60%] rounded-3xl bg-chat-user-bg px-5 py-3 shadow-md text-chat-user-fg">
                    <p className="text-[16px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            ) : (
                <div className="max-w-full rounded-3xl bg-chat-bot-bg px-5 py-2 text-chat-bot-fg">
                    <p className="text-[16px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            )}
        </div>
    )
}