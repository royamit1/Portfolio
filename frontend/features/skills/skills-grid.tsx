"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code2, Database, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const skills = [
    {
        category: "Frontend & Mobile",
        icon: Code2,
        color: "from-blue-500 to-cyan-500",
        items: [
            { name: "React", level: "expert" },
            { name: "Next.js", level: "expert" },
            { name: "TypeScript", level: "expert" },
            { name: "Tailwind CSS", level: "expert" },
            { name: ".NET MAUI", level: "intermediate" },
            { name: "Framer Motion", level: "intermediate" },
        ],
    },
    {
        category: "Backend & Database",
        icon: Database,
        color: "from-emerald-500 to-teal-500",
        items: [
            { name: "Python", level: "expert" },
            { name: "FastAPI", level: "expert" },
            { name: "Node.js", level: "expert" },
            { name: "C# / .NET", level: "intermediate" },
            { name: "PostgreSQL", level: "expert" },
            { name: "MongoDB", level: "intermediate" },
        ],
    },
    {
        category: "AI & DevOps",
        icon: Sparkles,
        color: "from-purple-500 to-pink-500",
        items: [
            { name: "OpenAI API", level: "expert" },
            { name: "LangChain", level: "expert" },
            { name: "pgvector", level: "intermediate" },
            { name: "Docker", level: "intermediate" },
            { name: "Git / GitHub", level: "expert" },
            { name: "Vercel / Render", level: "expert" },
        ],
    },
]

export function SkillsGrid() {
    const [isVisible, setIsVisible] = useState(false)
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

    useEffect(() => setIsVisible(true), [])

    return (
        <section className="relative w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                    {skills.map((category, index) => (
                        <SkillCategoryCard
                            key={category.category}
                            category={category}
                            index={index}
                            isHovered={hoveredCategory === category.category}
                            onHover={setHoveredCategory}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

interface SkillCategoryCardProps {
    category: (typeof skills)[0]
    index: number
    isHovered: boolean
    onHover: (category: string | null) => void
}

function SkillCategoryCard({ category, index, isHovered, onHover }: SkillCategoryCardProps) {
    const Icon = category.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => onHover(category.category)}
            onMouseLeave={() => onHover(null)}
            className={cn(
                "group relative overflow-hidden rounded-xl p-4 md:p-6",
                "bg-zinc-900/40 backdrop-blur-sm",
                "border border-white/5",
                "transition-all duration-300 cursor-default",
                "hover:border-white/10 hover:bg-zinc-900/60",
            )}
        >
            <div className="relative z-10 space-y-4 md:space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg transition-colors duration-300", "bg-white/5")}>
                            <Icon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                        </div>
                        <h3 className="font-semibold text-sm md:text-base text-white/80 group-hover:text-white/90 transition-colors">
                            {category.category}
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 md:gap-2">
                    {category.items.map((skill, idx) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
                            className={cn(
                                "relative overflow-hidden rounded-md p-2 md:p-2.5",
                                "bg-white/[0.02] backdrop-blur-sm",
                                "border border-white/5",
                                "transition-all duration-200",
                                "hover:bg-white/[0.04] hover:border-white/10",
                                "group/skill",
                            )}
                        >
                            <div className="relative z-10">
                                <p className="text-xs md:text-sm font-medium text-zinc-300 group-hover/skill:text-zinc-200 transition-colors text-center">
                                    {skill.name}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
