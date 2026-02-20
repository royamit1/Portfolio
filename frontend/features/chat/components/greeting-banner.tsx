"use client"

import { OptionButtons } from "@/features/chat/components/option-buttons"
import { motion } from "framer-motion"

interface GreetingBannerProps {
    onTopicSelect: (message: string) => void
}

// Greeting configuration - first line is static for LCP optimization
const GREETING_LINES = [
    {
        text: "👋 Hi, welcome to my portfolio!",
        className: "text-xl md:text-3xl font-bold text-foreground mx-auto text-balance"
    },
    {
        text: "No more scrolling through static pages. Have a real conversation about my work.",
        className: "text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent max-w-3xl mx-auto text-balance"
    },
    {
        text: "Ask it anything, or click a topic below to get started.",
        className: "text-sm md:text-lg text-foreground/75 pt-2 pb-4 mx-auto text-balance"
    }
];

const containerVariants = {
    hidden: { opacity: 0, y: 5 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.4, delayChildren: 0.2 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function GreetingBanner({ onTopicSelect }: GreetingBannerProps) {
    const [firstLine, ...animatedLines] = GREETING_LINES;

    return (
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-4">
            <div
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">

                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-zinc-900/80 to-zinc-900/80" />
                <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165,180,252,0.15) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10 p-4 md:p-10 text-center backdrop-blur-[2px]">
                    <div className="space-y-2 md:space-y-3">

                        {/* First line rendered statically for LCP */}
                        <p className={firstLine.className}>
                            {firstLine.text}
                        </p>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {animatedLines.map((line) => (
                                <motion.p
                                    key={line.text}
                                    variants={itemVariants}
                                    className={line.className}
                                >
                                    {line.text}
                                </motion.p>
                            ))}

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap justify-center items-center gap-6 pt-2 md:pt-4"
                            >
                                <OptionButtons onSelect={onTopicSelect} />

                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
