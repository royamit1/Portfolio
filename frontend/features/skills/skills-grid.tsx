"use client"

import {motion} from "framer-motion"
import {cn} from "@/lib/utils"
import {skills} from "./data/skills"

export function SkillsGrid() {
    return (
        <section className="relative w-full max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
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

function SkillCategoryCard({category, index}: SkillCategoryCardProps) {
    const Icon = category.icon

    return (
        <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: index * 0.1}}
            className={cn(
                "group relative overflow-hidden rounded-xl p-4 md:p-6",
                "bg-zinc-900/40 backdrop-blur-sm",
                "border border-white/5",
                "transition-all duration-300 cursor-default",
                "md:hover:border-white/10 md:hover:bg-zinc-900/60",
            )}
        >
            <div className="relative z-10 space-y-4 md:space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 transition-colors duration-300">
                            <Icon className="w-5 h-5 text-white/60 md:group-hover:text-white/80 transition-colors"/>
                        </div>
                        <h3 className="font-semibold text-sm md:text-base text-white/80 md:group-hover:text-white/90 transition-colors">
                            {category.category}
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 md:gap-2">
                    {category.items.map((skill, idx) => (
                        <motion.div
                            key={skill.name}
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.3, delay: index * 0.1 + idx * 0.05}}
                            className={cn(
                                "relative overflow-hidden rounded-md p-2 md:p-2.5",
                                "bg-white/[0.02] backdrop-blur-sm",
                                "border border-white/5",
                                "transition-all duration-200",
                                "md:hover:bg-white/[0.04] md:hover:border-white/10",
                                "group/skill",
                            )}
                        >
                            <div className="relative z-10">
                                <p className="text-xs md:text-sm font-medium text-zinc-300 md:group-hover/skill:text-zinc-200 transition-colors text-center">
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