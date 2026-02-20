"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { skills } from "./data/skills"

export function SkillsGrid() {
    return (
        <section className="relative w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

    // Map color strings to professional muted gradients
    const gradientMap: Record<string, { border: string; glow: string; icon: string; pill: string }> = {
        "from-slate-400 to-slate-500": {
            border: "group-hover:border-slate-500/20",
            glow: "bg-slate-500/10",
            icon: "text-slate-300",
            pill: "bg-slate-500/5 border-slate-500/10 text-slate-200 hover:bg-slate-500/10 hover:border-slate-500/20"
        },
        "from-zinc-400 to-zinc-500": {
            border: "group-hover:border-zinc-500/20",
            glow: "bg-zinc-500/10",
            icon: "text-zinc-300",
            pill: "bg-zinc-500/5 border-zinc-500/10 text-zinc-200 hover:bg-zinc-500/10 hover:border-zinc-500/20"
        },
        "from-neutral-400 to-neutral-500": {
            border: "group-hover:border-neutral-500/20",
            glow: "bg-neutral-500/10",
            icon: "text-neutral-300",
            pill: "bg-neutral-500/5 border-neutral-500/10 text-neutral-200 hover:bg-neutral-500/10 hover:border-neutral-500/20"
        },
        "from-gray-400 to-gray-500": {
            border: "group-hover:border-gray-500/20",
            glow: "bg-gray-500/10",
            icon: "text-gray-300",
            pill: "bg-gray-500/5 border-gray-500/10 text-gray-200 hover:bg-gray-500/10 hover:border-gray-500/20"
        }
    }

    const colors = gradientMap[category.color] || gradientMap["from-slate-400 to-slate-500"]

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl p-5 md:p-6",
                "bg-zinc-900/40 backdrop-blur-sm",
                "border border-white/5",
                "transition-all duration-500",
                colors.border,
            )}
        >
            {/* Subtle glow effect on hover */}
            <div className={cn(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                colors.glow
            )} />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all duration-300",
                        "group-hover:bg-white/[0.07] group-hover:border-white/10"
                    )}>
                        <Icon className={cn("w-5 h-5 transition-colors duration-300", colors.icon)} />
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-white/90 tracking-tight">
                        {category.category}
                    </h3>
                </div>

                {/* Skills as flowing pills */}
                <div className="flex flex-wrap gap-2">
                    {category.items.map((skill) => (
                        <span
                            key={skill.name}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm md:text-base font-medium",
                                "border backdrop-blur-sm",
                                "transition-all duration-200 cursor-default",
                                colors.pill
                            )}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
