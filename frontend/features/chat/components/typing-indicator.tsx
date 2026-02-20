"use client"

import { motion, type Transition } from "framer-motion"

// Animation configurations defined outside the component to prevent recreation on every render
const containerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
}

const circleVariants = {
    start: { y: "0%", opacity: 0.5 },
    end: { y: "-60%", opacity: 1 },
}

const circleTransition: Transition = {
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
                    variants={containerVariants}
                    initial="start"
                    animate="end"
                >
                    {/* Render 3 bouncing dots using a loop for cleaner JSX */}
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={`dot-${i}`}
                            className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-muted-foreground/60"
                            variants={circleVariants}
                            transition={circleTransition}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}