"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"
import { useChatContext } from "@/features/chat/context/chat-context"
import { cn } from "@/lib/utils"
import type { IconType } from "react-icons"

interface SocialItem {
    icon: IconType
    label: string
    url?: string
    action?: "contact"
}

const SOCIAL_ITEMS: SocialItem[] = [
    { icon: FaGithub, label: "GitHub", url: "https://github.com/royamit1" },
    { icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/royamit1/" },
    { icon: FaEnvelope, label: "Email", action: "contact" }
]

export function ProfileHeader() {
    const { setIsContactDialogOpen, tourStep } = useChatContext();

    const handleClick = (item: SocialItem) => {
        if (item.action === "contact") {
            setIsContactDialogOpen(true);
        } else if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer")
        }
    }

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
            <p className="text-base md:text-base text-zinc-400 leading-relaxed font-light mb-4">
                From mobile apps to web platforms, I bring creativity,
                problem-solving, and adaptability to every project.
            </p>

            {/* Social Links */}
            <div
                id="tour-social-links"
                className="flex gap-6 md:gap-9 justify-center mb-6"
            >
                {SOCIAL_ITEMS.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "group h-12 w-12 md:h-12 md:w-12 rounded-lg hover:text-indigo-400 active:text-indigo-400 hover:scale-[1.12] active:scale-[1.12] hover:shadow-lg active:shadow-lg transition-all duration-300 [&_svg]:size-6 md:[&_svg]:size-6",
                            tourStep?.targetId === "tour-social-links" && "relative z-50 text-indigo-400"
                        )}
                        onClick={() => handleClick(item)}
                        aria-label={item.label}
                    >
                        <item.icon className="size-5 md:size-6" />
                        <span className="sr-only">{item.label}</span>
                    </Button>
                ))}
            </div>

            {/* Gradient Separator */}
            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>
    )
}
