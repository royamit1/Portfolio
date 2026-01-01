"use client"

import React from "react"
import {motion} from "framer-motion"
import {SkillItem} from "@/features/skills/components/skill-item"

interface SkillCategoryProps {
    category: {
        category: string
        items: Array<{ name: string; description: string }>
    }
}

export const SkillCategory = React.memo(({category}: SkillCategoryProps) => (
    <motion.section
        variants={{
            hidden: {opacity: 0, y: 20},
            show: {opacity: 1, y: 0, transition: {duration: 0.5}},
        }}
        className="mb-8 last:mb-0"
    >
        {/* Decorative Header with Gradient Lines */}
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"/>
            <h3 className="font-medium text-indigo-300/90 text-xs uppercase tracking-widest px-2">
                {category.category}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"/>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {category.items.map((skill) => (
                <SkillItem key={skill.name} skill={skill}/>
            ))}
        </div>
    </motion.section>
))

SkillCategory.displayName = "SkillCategory"