"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SENTENCES = [
    "Writes clean code, messy commit messages.",
    "Debugging my own code like it's someone else's.",
    "Good at naming variables... eventually.",
    "Can center a div, but not my life.",
    "Turns coffee into code (and bugs).",
    "Works in mysterious ways (mostly mysterious).",
    "Refactors code, not habits.",
    "Knows the theory, forgets the syntax.",
    "Code reviews are my cardio.",
    "Full-stack in theory, front-end in panic.",
    "Always one semicolon away from disaster.",
    "Commit messages are a work of fiction.",
    "Google is my co-pilot.",
    "Can solve bugs, can't solve my sleep schedule.",
    "Pushes code and pushes my luck.",
    "Syntax errors fear me. Logic errors mock me.",
    "Stack Overflow is my spirit animal.",
    "Writes comments nobody reads.",
    "Knows CSS, still can't make it look the same everywhere.",
    "Compiles successfully, runs accidentally."
]

export function TaglineRotator() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const rotateSentence = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SENTENCES.length)
    }, [])

    useEffect(() => {
        const interval = setInterval(rotateSentence, 7000)
        return () => clearInterval(interval)
    }, [rotateSentence])

    return (
        <div className="mt-3 text-center text-xs md:text-sm font-medium text-white/60">
            {/* mode="wait" ensures the old text fades out completely before the new text fades in */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentIndex}
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                >
                    {SENTENCES[currentIndex]}
                </motion.p>
            </AnimatePresence>
        </div>
    )
}