"use client"

import {OptionButtons} from "@/features/chat/components/option-buttons"
import {motion} from "framer-motion"
import {useCallback} from "react";

interface GreetingBannerProps {
    onTopicSelect: (message: string) => void
}

export function GreetingBanner({onTopicSelect}: GreetingBannerProps) {
    const lines = [
        "👋 Hey there, welcome to my portfolio!",
        "I\u0027m an interactive chatbot. I can guide you through my skills, projects, and background.",
        "Ask your own questions, or use the suggestions below to get started.",
    ]

    const getLineClass = (index: number) => {
        switch (index) {
            case 0:
                return "text-xl md:text-3xl font-bold text-foreground"
            case 1:
                return "text-base md:text-lg font-bold bg-gradient-to-r from-accent to-purple-700 bg-clip-text text-transparent"
            default:
                return "text-xs md:text-base text-foreground/75 pt-2 pb-4"
        }
    }

    const handleTopicSelect = useCallback((message: string) => {
        onTopicSelect(message)
    }, [onTopicSelect])

    const containerVariants = {
        hidden: {opacity: 0, y: 5},
        show: {
            opacity: 1,
            transition: {staggerChildren: 0.4, delayChildren: 0.2}, // Added delayChildren to sync with static first line
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 5},
        show: {opacity: 1, y: 0, transition: {duration: 0.4}},
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-4">
            <div
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-zinc-900/80 to-zinc-900/80"/>
                <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165,180,252,0.15) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10 p-4 md:p-10 text-center backdrop-blur-[2px]">
                    {/*
                        LCP OPTIMIZATION:
                        The first line is rendered statically (without motion) to ensure it paints immediately.
                        This eliminates the "Element render delay" caused by waiting for JS hydration.
                    */}
                    <div className="space-y-2 md:space-y-3">
                        <p className={getLineClass(0)}>
                            {lines[0]}
                        </p>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {lines.slice(1).map((text, index) => (
                                <motion.p key={index + 1} variants={itemVariants} className={getLineClass(index + 1)}>
                                    {text}
                                </motion.p>
                            ))}

                            <motion.div
                                variants={itemVariants}
                                className="flex justify-center pt-2 md:pt-4"
                            >
                                <OptionButtons onSelect={handleTopicSelect}/>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
