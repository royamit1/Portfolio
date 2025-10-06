"use client"

import {OptionButtons} from "@/components/chat/option-buttons.tsx"
import type {Topic} from "@/lib/types.ts"
import {motion} from "framer-motion"

interface GreetingBannerProps {
    onTopicSelect: (topic: Topic) => void
}

export function GreetingBanner({onTopicSelect}: GreetingBannerProps) {
    const lines = [
        "👋 Hey there, welcome to my portfolio!",
        "This portfolio is powered by an interactive chatbot. " +
        "It’s designed to guide you through my background, skills, and projects in a more engaging way.",
        "Ask your own questions, or use the suggestions below to get started.",
    ]

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.5, // everything fades in one after another
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 10},
        show: {opacity: 1, y: 0, transition: {duration: 0.6}},
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-10 max-w-4xl text-center border border-border">
                <motion.div
                    className="space-y-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {lines.map((text, index) => (
                        <motion.p
                            key={index}
                            variants={itemVariants}
                            className={`leading-relaxed ${
                                index === 0
                                    ? "text-3xl font-bold text-foreground"
                                    : index === 1
                                        ? "text-lg font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent"
                                        : "text-base md:text-md text-foreground/75 py-4"
                            }`}
                        >
                            {text}
                        </motion.p>
                    ))}

                    {/* Buttons animate just like the lines */}
                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center"
                    >
                        <OptionButtons onSelect={onTopicSelect}/>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
