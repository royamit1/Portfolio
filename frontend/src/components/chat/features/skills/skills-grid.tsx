"use client"

import {useState, useEffect} from "react"
import {motion, stagger} from "framer-motion"
import {SkillCategory} from "@/components/chat/features/skills/skill-category.tsx"

const skills = [
    {
        category: "Frontend Development",
        items: [
            {
                name: "React & Next.js",
                description:
                    "I build modern, fast, and accessible web apps using React and Next.js — focusing on clean architecture and smooth user experiences.",
            },
            {
                name: "TypeScript",
                description:
                    "Strongly typed code keeps large projects reliable and maintainable. I use TypeScript daily to write safer, more predictable code.",
            },
            {
                name: "Tailwind CSS",
                description:
                    "Designing responsive, elegant UIs with Tailwind’s utility-first approach — keeping code clean and easy to iterate on.",
            },
            {
                name: "UI & UX Principles",
                description:
                    "I care deeply about usability — crafting interfaces that feel intuitive, consistent, and accessible to everyone.",
            },
        ],
    },
    {
        category: "Backend & Infrastructure",
        items: [
            {
                name: "Python & FastAPI",
                description:
                    "Building reliable, high-performance APIs with FastAPI — optimized for clarity, async operations, and maintainability.",
            },
            {
                name: "PostgreSQL",
                description:
                    "Designing structured, efficient databases and writing optimized queries to handle real-world scale and reliability.",
            },
            {
                name: "Node.js",
                description:
                    "Creating backend services that handle complex logic while staying lightweight, scalable, and event-driven.",
            },
            {
                name: "Docker",
                description:
                    "Using Docker to keep environments consistent and deployments smooth across development and production.",
            },
        ],
    },
    {
        category: "AI & Modern Tools",
        items: [
            {
                name: "OpenAI Integration",
                description:
                    "Developing intelligent apps powered by OpenAI — from chat assistants to smart retrieval systems and embeddings.",
            },
            {
                name: "Vector Databases",
                description:
                    "Working with Pinecone, FAISS, and similar tools for semantic search and retrieval-augmented generation (RAG).",
            },
            {
                name: "Git & CI/CD",
                description:
                    "Version control, automated testing, and deployment pipelines that keep projects stable and fast-moving.",
            },
            {
                name: "Cloud Platforms",
                description:
                    "Deploying and scaling applications on AWS and GCP using serverless and container-based solutions.",
            },
        ],
    },
]

export function SkillsGrid() {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => setIsVisible(true), [])

    return (
        <section
            id="SkillsGrid"
            className="relative w-full max-w-4xl flex flex-col items-center justify-center px-4 py-8 rounded-3xl
                 bg-gradient-to-br from-gray-100 via-white to-gray-100
                 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden font-sans"
        >
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-white/10 pointer-events-none"/>
            <div className="text-center mb-10 px-6 max-w-4xl relative z-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 mb-4">
                    Technical Expertise
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 drop-shadow-xl dark:drop-shadow-2xl">
                    My Core Skills
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mx-auto leading-relaxed max-w-3xl">
                    A modern full-stack skillset — focused on clean architecture, scalable backend systems, and refined
                    UI design.
                </p>
                <div
                    className="mt-6 mx-auto w-56 h-1 bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent rounded-full"/>
            </div>

            <motion.div
                initial={{opacity: 0}}
                animate={
                    isVisible
                        ? {
                            opacity: 1,
                            transition: {
                                duration: 0.6,
                                delayChildren: stagger(0.1),
                            },
                        }
                        : {}
                }
                className="w-full max-w-3xl mx-auto space-y-10 relative z-10"
            >
                {skills.map((category, index) => (
                    <SkillCategory key={category.category} category={category} index={index}/>
                ))}
            </motion.div>
        </section>
    )
}