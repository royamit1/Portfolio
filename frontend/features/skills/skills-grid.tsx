"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { skills } from "./data/skills"

export function SkillsGrid() {
    return (
        <section className="relative w-full max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {skills.map((category, index) => (
                        <SkillCategoryCard
                            key={category.category}
                            category={category}
                            index={index}
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
}

function SkillCategoryCard({ category, index }: SkillCategoryCardProps) {
    const Icon = category.icon

    // Map color strings to actual gradient classes
    const gradientMap: Record<string, { border: string; glow: string; icon: string; pill: string }> = {
        "from-blue-500 to-cyan-500": {
            border: "group-hover:border-blue-500/30",
            glow: "bg-blue-500/20",
            icon: "text-blue-400",
            pill: "bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/30"
        },
        "from-emerald-500 to-teal-500": {
            border: "group-hover:border-emerald-500/30",
            glow: "bg-emerald-500/20",
            icon: "text-emerald-400",
            pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/30"
        },
        "from-purple-500 to-pink-500": {
            border: "group-hover:border-purple-500/30",
            glow: "bg-purple-500/20",
            icon: "text-purple-400",
            pill: "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/30"
        }
    }

    const colors = gradientMap[category.color] || gradientMap["from-blue-500 to-cyan-500"]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-5 md:p-6",
                "bg-zinc-900/60 backdrop-blur-sm",
                "border border-white/10",
                "transition-all duration-500",
                colors.border,
            )}
        >
            {/* Subtle glow effect on hover */}
            <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
                colors.glow
            )} />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all duration-300",
                        "group-hover:bg-white/10 group-hover:border-white/10"
                    )}>
                        <Icon className={cn("w-5 h-5 transition-colors duration-300", colors.icon)} />
                    </div>
                    <h3 className="font-bold text-base text-white/90 tracking-tight">
                        {category.category}
                    </h3>
                </div>

                {/* Skills as flowing pills */}
                <div className="flex flex-wrap gap-2">
                    {category.items.map((skill, idx) => (
                        <motion.span
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium",
                                "border backdrop-blur-sm",
                                "transition-all duration-200 cursor-default",
                                colors.pill
                            )}
                        >
                            {skill.name}
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}