"use client"

import {useEffect, useState} from "react"
import {OptionButtons} from "@/components/option_buttons"
import type {Topic} from "@/lib/types"

interface GreetingBannerProps {
    onTopicSelect: (topic: Topic) => void
}

export function GreetingBanner({onTopicSelect}: GreetingBannerProps) {
    const [showText, setShowText] = useState(false)
    const [showButtons, setShowButtons] = useState(false)

    const lines = [
        "👋 Hey there, welcome to my portfolio!",
        "I'm Alex, a developer passionate about building intelligent, interactive experiences.",
        "This AI-powered chatbot can guide you through my projects, technical skills, and professional journey.",
        "I thrive on creativity, problem-solving, and adapting to new challenges—let's explore what I can bring to your team!",
    ]

    useEffect(() => {
        setShowText(true)

        const timer = setTimeout(() => {
            setShowButtons(true)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`space-y-3 text-center max-w-4xl transition-all duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}
            >
                {lines.map((text, index) => (
                    <p
                        key={index}
                        className={`leading-relaxed ${
                            index === 0
                                ? "text-3xl font-bold text-foreground"
                                : index === 1
                                    ? "text-xl font-semibold text-foreground/95"
                                    : index === 2
                                        ? "text-base text-muted-foreground"
                                        : "text-base text-muted-foreground/90 italic"
                        }`}
                    >
                        {text}
                    </p>
                ))}
            </div>

            <div
                className={`mt-6 transition-all duration-700 ${showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}

            >
                <OptionButtons onSelect={onTopicSelect}/>
            </div>
        </div>
    )
}
