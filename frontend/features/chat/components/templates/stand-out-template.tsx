"use client"

import { useCallback, useState } from "react"
import { StreamingText } from "./streaming-text"
import type { Message } from "@/lib/types"

const SECTIONS = [
    {
        html: `Great question! What sets me apart is a unique combination of **strong academic foundations**, real-world production experience, and a genuine passion for craftsmanship.`
    },
    {
        html: `First, my **computer science background** from Bar-Ilan University gave me solid understanding of algorithms, data structures, and software engineering principles. But I didn't stop at theory — I'm now building **production-grade real-time communication systems** at Commit, working with technologies like **C#** and **.NET MAUI**.`
    },
    {
        html: `What really drives me is my focus on **clean architecture**. I'm passionate about MVVM, SOLID principles, and writing code that's not just functional — but **maintainable, scalable, and elegant**. It's not just about making it work; it's about making it right.`
    },
    {
        html: `I'm also a **full-stack developer** who's equally comfortable with backend C#/.NET architecture and modern web technologies like **TypeScript**, **React**, and **Next.js**. My side project, **Cooksmith AI**, is a testament to that — an AI-powered recipe platform I'm building with OpenAI integration.`
    },
    {
        html: `But perhaps what truly makes me different is that I'm a **continuous learner** and a **product-minded engineer**. I'm currently exploring **Vue.js** and **NestJS** because I believe in staying ahead. And when I build, I don't just write code — I care deeply about creating products that users genuinely love. ❤️`
    },
    {
        html: `Bottom line: I bring the perfect blend of academic rigor, hands-on experience, architectural discipline, and genuine passion for building meaningful software.`,
        isItalic: true
    }
]

interface StandOutTemplateProps {
    message?: Message
}

export function StandOutTemplate({ message }: StandOutTemplateProps) {
    // Skip streaming for restored message history (older than 3s)
    const [isHistorical] = useState(() =>
        message ? (Date.now() - new Date(message.timestamp).getTime() > 3000) : false
    )
    const [currentSection, setCurrentSection] = useState(() => isHistorical ? SECTIONS.length - 1 : 0)

    const handleSectionComplete = useCallback((index: number) => {
        if (index < SECTIONS.length - 1) {
            setCurrentSection(prev => Math.max(prev, index + 1))
        }
    }, [])

    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-start">
                <div className="max-w-[90%] md:max-w-[95%] px-4 md:px-5 text-zinc-200">
                    <div className="space-y-5 leading-7 tracking-wide font-light">

                        {SECTIONS.map((section, index) => {
                            if (index > currentSection) return null

                            return (
                                <p
                                    key={index}
                                    className={`mb-5 block last:mb-0 ${section.isItalic ? 'text-zinc-400 italic' : ''}`}
                                >
                                    <StreamingText
                                        text={section.html}
                                        delay={index === 0 ? 100 : 0}
                                        speed={15}
                                        onComplete={() => handleSectionComplete(index)}
                                        instant={isHistorical}
                                    />
                                </p>
                            )
                        })}

                    </div>
                </div>
            </div>
        </div>
    )
}
