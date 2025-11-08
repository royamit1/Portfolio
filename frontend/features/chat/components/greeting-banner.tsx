"use client"

import {OptionButtons} from "@/features/chat/components/option-buttons"
import type {Topic} from "@/lib/types"
import {motion} from "framer-motion"
import {useCallback} from "react";

interface GreetingBannerProps {
    onTopicSelect: (topic: Topic) => void
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
                return "text-2xl md:text-3xl font-bold text-foreground"
            case 1:
                return "text-lg md:text-lg font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent"
            default:
                return "text-sm md:text-base text-foreground/75 pt-2 pb-4"
        }
    }

    const handleTopicSelect = useCallback((topic: Topic) => {
        onTopicSelect(topic)
    }, [onTopicSelect])

    const containerVariants = {
        hidden: {opacity: 0, y: 5},
        show: {
            opacity: 1,
            transition: {staggerChildren: 0.4},
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 5},
        show: {opacity: 1, y: 0, transition: {duration: 0.4}},
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 max-w-4xl text-center border border-border">                <motion.div
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {lines.map((text, index) => (
                        <motion.p key={index} variants={itemVariants} className={getLineClass(index)}>
                            {text}
                        </motion.p>
                    ))}

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center pt-2"
                    >
                        <OptionButtons onSelect={handleTopicSelect}/>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
