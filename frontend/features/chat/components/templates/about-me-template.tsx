"use client"

import { motion } from "framer-motion"
import { useCallback, useState } from "react"
import Image from "next/image"
import { StreamingText } from "./streaming-text"
import type { Message } from "@/lib/types"

const SECTIONS = [
    {
        html: `Hi there! I'm **Roy Amit**, a **Full-Stack Developer** who thrives on building complex, high-performance systems. At **Commit**, I specialize in architectural design and cross-platform development using **C#** and **.NET MAUI**.`
    },
    {
        html: `My engineering philosophy is rooted in my **B.Sc. in Computer Science** from **Bar-Ilan University**. Whether I'm designing **real-time communication systems** or optimizing backend performance, I apply clean principles like **MVVM** and **SOLID** to ensure every line of code is robust and scalable.`
    },
    {
        html: `Leadership is also part of my DNA. Serving as a **Tank Commander** taught me how to take ownership and manage high-pressure situations — skills that I bring to every project, ensuring delivery even when the heat is on.`
    },
    {
        html: `Beyond the code, I'm a creator and a competitor. You might catch me **playing the piano** 🎹, on the **gymnastics** floor 🤸‍♂️, or spiking in **beach volleyball** 🏐. I believe that discipline in hobbies translates directly to discipline in craft.`
    },
    {
        html: `Right now, I'm channeling that creativity into **Cooksmith AI**—a **Next.js** and **OpenAI** powered platform I'm building to revolutionize how we cook. It's the perfect playground for my full-stack passion.`,
        isItalic: true
    }
]

interface AboutMeTemplateProps {
    message?: Message
}

export function AboutMeTemplate({ message }: AboutMeTemplateProps) {
    // Determine if this is a restored message history (older than 3 seconds)
    // Use useState initializer to calculate ONLY ONCE at mount, not on every re-render
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
                    className="w-full md:w-1/3 shrink-0 self-start"
                >
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-2 md:p-3 shadow-xl">
                        <div className="aspect-video md:aspect-[4/5] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden relative">
                            <Image
                                src="/ghibli-developer.png"
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
                <div className="w-full md:w-2/3 text-zinc-200">
                    <div className="space-y-5 leading-7 tracking-wide font-light">
                        {SECTIONS.map((section, index) => {
                            if (index > currentSection) return null

                            // Need a stable key that doesn't change
                            return (
                                <p
                                    key={index}
                                    className={`mb-5 block last:mb-0 ${section.isItalic ? 'text-zinc-400 italic' : ''}`}
                                >
                                    <StreamingText
                                        text={section.html}
                                        delay={index === 0 ? 500 : 0} // Slight delay for first visual impact
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
