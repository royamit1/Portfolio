"use client"

import React from "react"

export function ProfileHeader() {
    return (
        <div className="relative z-10 flex flex-col pt-8 pb-1 px-6 md:px-5">
            {/* Role Label */}
            <div className="mb-2">
                <span className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase text-indigo-400">
                    Full-Stack Developer
                </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Roy Amit
            </h1>

            {/* Bio */}
            <p className="text-base md:text-base text-zinc-400 leading-relaxed font-light mb-6">
                From mobile apps to web platforms, I bring creativity,
                problem-solving, and adaptability to every project.
            </p>

            {/* Gradient Separator */}
            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>
    )
}