"use client"

import {OptionButtons} from "@/features/chat/components/option-buttons"
import {motion} from "framer-motion"
import {Loader2, Sparkles} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useTour} from "@/features/tour/useTour"

interface GreetingBannerProps {
    onTopicSelect: (message: string) => void
}

// Configuration for greeting lines to keep logic and content separate.
// The first item is treated specially for LCP optimization.
const GREETING_LINES = [
    {
        text: "👋 Hey there, welcome to my portfolio!",
        className: "text-xl md:text-3xl font-bold text-foreground"
    },
    {
        text: "I'm an interactive chatbot. I can guide you through my skills, projects, and background.",
        className: "text-base md:text-lg font-bold bg-gradient-to-r from-accent to-purple-700 bg-clip-text text-transparent"
    },
    {
        text: "Ask your own questions, or use the suggestions below to get started.",
        className: "text-xs md:text-base text-foreground/75 pt-2 pb-4"
    }
];

const containerVariants = {
    hidden: {opacity: 0, y: 5},
    show: {
        opacity: 1,
        transition: {staggerChildren: 0.4, delayChildren: 0.2},
    },
}

const itemVariants = {
    hidden: {opacity: 0, y: 5},
    show: {opacity: 1, y: 0, transition: {duration: 0.4}},
}

export function GreetingBanner({onTopicSelect}: GreetingBannerProps) {
    const {startTour, isTourActive} = useTour()
    const [firstLine, ...animatedLines] = GREETING_LINES;

    return (
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-4">
            <div
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">

                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-zinc-900/80 to-zinc-900/80"/>
                <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165,180,252,0.15) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10 p-4 md:p-10 text-center backdrop-blur-[2px]">
                    <div className="space-y-2 md:space-y-3">

                        {/* LCP OPTIMIZATION:
                            The first line is rendered statically (without motion) to ensure it paints immediately.
                            This eliminates the "Element render delay" caused by waiting for JS hydration.
                        */}
                        <p className={firstLine.className}>
                            {firstLine.text}
                        </p>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {animatedLines.map((line, index) => (
                                <motion.p
                                    key={index}
                                    variants={itemVariants}
                                    className={line.className}
                                >
                                    {line.text}
                                </motion.p>
                            ))}

                            {/* Action Buttons Area */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap justify-center items-center gap-6 pt-2 md:pt-4"
                            >
                                {/* 2. The Existing Options */}
                                <OptionButtons onSelect={onTopicSelect}/>

                                {/*/!* 3. The New Quick Tour Button *!/*/}
                                {/*<Button*/}
                                {/*    variant="outline"*/}
                                {/*    size="lg"*/}
                                {/*    onClick={startTour}*/}
                                {/*    disabled={isTourActive}*/}
                                {/*    className="rounded-xl border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all"*/}
                                {/*>*/}
                                {/*    {isTourActive ? (*/}
                                {/*        <>*/}
                                {/*            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin"/>*/}
                                {/*            Giving Tour...*/}
                                {/*        </>*/}
                                {/*    ) : (*/}
                                {/*        <>*/}
                                {/*            <Sparkles className="mr-2 h-3.5 w-3.5"/>*/}
                                {/*            Quick Tour*/}
                                {/*        </>*/}
                                {/*    )}*/}
                                {/*</Button>*/}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
