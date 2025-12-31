"use client"

import { motion } from "framer-motion"
import React from "react"

interface SkillItemProps {
    skill: { name: string; description: string }
    index: number
}

// 1. Define the component with a clear name.
const SkillItemComponent: React.FC<SkillItemProps> = ({ skill }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, scale: 0.95 },
            show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        }}
        className="relative overflow-hidden bg-zinc-900/50 border border-white/5 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-zinc-800/50 hover:border-indigo-500/30 group cursor-default"
    >
        {/* Hover Gradient Effect */}
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
                background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            }}
        />

        <div className="flex items-center justify-center text-center relative z-10">
            <h4 className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors duration-300">
                {skill.name}
            </h4>
        </div>
    </motion.div>
)

// 2. Export the memoized version of the named component.
export const SkillItem = React.memo(SkillItemComponent)
