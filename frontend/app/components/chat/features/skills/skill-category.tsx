"use client"

import {motion} from "framer-motion"
import React from "react"
import {SkillItem} from "@/app/components/chat/features/skills/skill-item"

interface SkillCategoryProps {
    category: { category: string; items: Array<{ name: string; description: string }> }
    index: number
}

export const SkillCategory: React.FC<SkillCategoryProps> = React.memo(({category}) => (
    <motion.section
        variants={{
            hidden: {opacity: 0, x: -20},
            show: {opacity: 1, x: 0, transition: {duration: 0.5}},
        }}
        className="mb-10 last:mb-0"
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-teal-500"/>
            <h3 className="font-semibold text-gray-100 text-sm uppercase tracking-wider">
                {category.category}
            </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.items.map((skill, idx) => (
                <SkillItem key={skill.name} skill={skill} index={idx}/>
            ))}
        </div>
    </motion.section>
))

SkillCategory.displayName = "SkillCategory"
