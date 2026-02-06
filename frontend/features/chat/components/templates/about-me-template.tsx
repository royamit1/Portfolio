"use client"

import { motion } from "framer-motion"
import { useCallback, useState } from "react"
import Image from "next/image"
import { StreamingText } from "./streaming-text"
import type { Message } from "@/lib/types"

const SECTIONS = [
    {
        html: `Hey! 👋 I'm **Roy** — a Full-Stack Developer with a passion for building software that's both powerful and well-crafted.`
    },
    {
        html: `I'm currently at **Commit**, where I develop cross-platform apps using **C#** and **.NET MAUI**. My main focus is **real-time video and voice communication systems** — complex, performance-critical work that I find genuinely exciting.`
    },
    {
        html: `I studied **Computer Science at Bar-Ilan University** (graduated with an 85 GPA), with a focus on clean architecture principles like **MVVM** and **SOLID**. Before that, I served as a **Tank Commander** in the IDF — an experience that taught me a lot about leadership and staying calm under pressure.`
    },
    {
        html: `Tech-wise, I work across the stack: **TypeScript**, **React**, **Next.js**, **PostgreSQL**, and **C#/.NET**. I'm currently exploring **Vue.js** and **NestJS** — always happy to learn something new.`
    },
    {
        html: `Outside of work, I play **piano** 🎹, do **gymnastics** 🤸‍♂️, and play **beach volleyball** 🏐. I'm also really into **AI** — both this portfolio (yes, you're talking to an AI!) and **Cooksmith AI** (a recipe app I'm building with a friend) are examples of that.`,
        isItalic: true
    }
]

interface AboutMeTemplateProps {
    message?: Message
}

export function AboutMeTemplate({ message }: AboutMeTemplateProps) {
    // Skip streaming for restored message history (older than 3s)
    const [isHistorical] = useState(() =>
        message ? (Date.now() - new Date(message.timestamp).getTime() > 3000) : false
    )

    const [currentSection, setCurrentSection] = useState(() => isHistorical ? SECTIONS.length - 1 : 0)

    const handleSectionComplete = useCallback((index: number) => {
        if (index < SECTIONS.length - 1) {
            // Only advance if we haven't already
            setCurrentSection(prev => Math.max(prev, index + 1))
        }
    }, [])

    return (
        <div className="w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Visual Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-1/3 shrink-0 self-start px-4 md:px-0"
                >
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-2 md:p-3 shadow-xl">
                        <div className="aspect-[4/3] md:aspect-[4/5] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden relative">
                            <Image
                                src="/ghibli-developer.webp"
                                alt="Roy Amit - Full Stack Developer"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="w-full md:w-2/3 text-zinc-200 px-4 md:px-0">
                    <div className="space-y-5 leading-7 tracking-wide font-light">
                        {SECTIONS.map((section, index) => {
                            if (index > currentSection) return null
                            return (
                                <div
                                    key={index}
                                    className={`mb-5 last:mb-0 ${section.isItalic ? 'text-zinc-400 italic' : ''}`}
                                >
                                    <StreamingText
                                        text={section.html}
                                        delay={index === 0 ? 500 : 0} // Slight delay for first visual impact
                                        speed={15}
                                        onComplete={() => handleSectionComplete(index)}
                                        instant={isHistorical}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
