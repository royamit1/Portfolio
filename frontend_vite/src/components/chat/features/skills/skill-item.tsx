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
            hidden: {opacity: 0, y: 10},
            show: {opacity: 1, y: 0, transition: {duration: 0.4}},
        }}
        className="relative overflow-hidden bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
        <div
            className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-teal-400/0 via-teal-400/80 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
        <h4 className="font-bold text-gray-100 mb-1">{skill.name}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">{skill.description}</p>
    </motion.div>
))