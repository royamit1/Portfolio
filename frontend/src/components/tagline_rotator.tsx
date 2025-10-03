"use client"

import {useEffect, useState} from "react"

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
    const [currentSentence, setCurrentSentence] = useState(SENTENCES[0])
    const [fade, setFade] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false) // start fade out
            setTimeout(() => {
                const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
                setCurrentSentence(randomSentence)
                setFade(true) // fade in new sentence
            }, 500) // fade duration
        }, 7000) // every 10 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div
            className={`mt-3 text-center text-[12px] font-medium text-white/60 transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
            }`}
        >
            {currentSentence}
        </div>
    )
}
