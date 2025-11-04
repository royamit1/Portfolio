"use client"

import {motion, type Transition} from "framer-motion"

const typingContainerVariants = {
    start: {
        transition: {
            staggerChildren: 0.2,
        },
    },
    end: {
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const typingCircleVariants = {
    start: {
        y: "0%",
        opacity: 0.5,
    },
    end: {
        y: "-60%",
        opacity: 1,
    },
}

const typingCircleTransition: Transition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
}

export function TypingIndicator() {
    return (
        <div className="flex items-center justify-start animate-in fade-in slide-in-from-bottom-2 px-5 duration-300">
            <div className="max-w-[80%] py-3">
                <motion.div
                    className="flex gap-1.5"
                    variants={typingContainerVariants}
                    initial="start"
                    animate="end"
                >
                    <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground/60"
                        variants={typingCircleVariants}
                        transition={typingCircleTransition}
                    />
                    <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground/60"
                        variants={typingCircleVariants}
                        transition={typingCircleTransition}
                    />
                    <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground/60"
                        variants={typingCircleVariants}
                        transition={typingCircleTransition}
                    />
                </motion.div>
            </div>
        </div>
    )
}
