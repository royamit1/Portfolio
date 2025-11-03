import type React from "react"
import {cn} from "@/lib/utils.ts"
import type {Message} from "@/lib/types.ts"
import {SkillsGrid} from "@/components/chat/features/skills/skills-grid.tsx"
import ThreeDCarousel from "@/components/chat/features/projects-carousel.tsx"
import ResumeCard from "@/components/chat/features/resume-card.tsx"
import {projects} from "@/components/chat/features/projects.tsx"
import {useTypewriter} from "@/hooks/use-typewriter.tsx"

interface ChatBubbleProps {
    message: Message
    style?: React.CSSProperties
}

export function ChatBubble({message, style}: ChatBubbleProps) {
    const isUser = message.role === "user"
    const {typedText} = useTypewriter(isUser ? "" : message.content)

    if (message.showProjectCards && !isUser) {
        return (
            <div className="flex justify-evenly" style={style}>
                <div className="max-w-full">
                    <ThreeDCarousel
                        items={projects}
                        autoRotate={true}
                        rotateInterval={4000}
                        cardHeight={{base: 400, md: 500}}
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
                <div
                    className="max-w-[80%] md:max-w-[60%] rounded-3xl bg-chat-user-bg px-4 py-2 md:px-5 md:py-3 shadow-md text-chat-user-fg">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
            ) : (
                <div className="max-w-full rounded-3xl bg-chat-bot-bg px-4 py-2 md:px-5 md:py-3 text-chat-bot-fg">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{typedText}</p>
                </div>
            )}
        </div>
    )
}