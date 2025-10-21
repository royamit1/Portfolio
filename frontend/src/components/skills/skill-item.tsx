"use client"

import {motion} from "framer-motion"
import React from "react"

interface SkillItemProps {
    skill: { name: string; description: string }
    index: number
}

export const SkillItem: React.FC<SkillItemProps> = React.memo(({skill}) => (
    <motion.div
        variants={{
            hidden: {opacity: 0, y: 8},
            show: {opacity: 1, y: 0, transition: {duration: 0.4}},
        }}
        className="group relative"
    >
        <div
            className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50
                 dark:border-gray-700/50 rounded-xl p-4 shadow-sm hover:shadow-md
                 transition-all duration-300 hover:-translate-y-0.5"
        >
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5 tracking-tight">
                {skill.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                {skill.description}
            </p>

            <div
                className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-teal-400/0 via-teal-400/30 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500"/>
        </div>
    </motion.div>
))
