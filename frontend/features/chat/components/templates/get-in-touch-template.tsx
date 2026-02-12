"use client"

import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa"
import { StreamingText } from "./streaming-text"
import { useChatContext } from "@/features/chat/context/chat-context"
import type { Message } from "@/lib/types"
import type { IconType } from "react-icons"

const INTRO_TEXT = `I'd love to connect! Here are the best ways to reach me 👇`

interface ContactCard {
    icon: IconType
    title: string
    description: string
    color: string
    action: "linkedin" | "github" | "contact" | "resume"
}

const CONTACT_CARDS: ContactCard[] = [
    {
        icon: FaLinkedin,
        title: "Connect on LinkedIn",
        description: "Let's grow our professional network",
        color: "from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-blue-500/20",
        action: "linkedin",
    },
    {
        icon: FaGithub,
        title: "Check out my code",
        description: "Explore my projects and contributions",
        color: "from-zinc-500/20 to-zinc-600/20 hover:from-zinc-500/30 hover:to-zinc-600/30 border-zinc-400/20",
        action: "github",
    },
    {
        icon: FaEnvelope,
        title: "Send me a message",
        description: "I'll get back to you as soon as I can",
        color: "from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border-indigo-500/20",
        action: "contact",
    },
    {
        icon: FaFileAlt,
        title: "View my resume",
        description: "Download or browse my full CV",
        color: "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-500/20",
        action: "resume",
    },
]

const URLS: Record<string, string> = {
    linkedin: "https://www.linkedin.com/in/royamit1/",
    github: "https://github.com/royamit1",
}

interface GetInTouchTemplateProps {
    message?: Message
}

export function GetInTouchTemplate({ message }: GetInTouchTemplateProps) {
    const { setIsContactDialogOpen, onTopicSelect, scrollToBottom } = useChatContext()

    const [isHistorical] = useState(() =>
        message ? (Date.now() - new Date(message.timestamp).getTime() > 3000) : false
    )
    const [showCards, setShowCards] = useState(isHistorical)

    const handleIntroComplete = useCallback(() => {
        setShowCards(true)
    }, [])

    // Auto-scroll when cards appear
    useEffect(() => {
        if (showCards && !isHistorical) {
            scrollToBottom('smooth')
        }
    }, [showCards, isHistorical, scrollToBottom])

    const handleStream = useCallback(() => {
        if (!isHistorical) scrollToBottom('smooth')
    }, [isHistorical, scrollToBottom])

    const handleCardClick = (card: ContactCard) => {
        switch (card.action) {
            case "linkedin":
            case "github":
                window.open(URLS[card.action], "_blank", "noopener,noreferrer")
                break
            case "contact":
                setIsContactDialogOpen(true)
                break
            case "resume":
                onTopicSelect("resume")
                break
        }
    }

    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-start">
                <div className="max-w-[90%] md:max-w-[95%] px-4 md:px-5 text-zinc-200">
                    {/* Streaming intro */}
                    <div className="leading-7 tracking-wide font-light mb-6">
                        <StreamingText
                            text={INTRO_TEXT}
                            delay={100}
                            speed={8}
                            onComplete={handleIntroComplete}
                            onStream={handleStream}
                            instant={isHistorical}
                        />
                    </div>

                    {/* Contact cards grid */}
                    {showCards && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            {CONTACT_CARDS.map((card) => (
                                <motion.button
                                    key={card.action}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => handleCardClick(card)}
                                    className={`group flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-br ${card.color} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/20 active:scale-[0.98] text-left`}
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                                        <card.icon className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors duration-300">
                                            {card.title}
                                        </p>
                                        <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 truncate">
                                            {card.description}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
