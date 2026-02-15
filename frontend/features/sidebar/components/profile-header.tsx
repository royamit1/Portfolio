"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
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
    const [isFlipped, setIsFlipped] = useState(false);

    // Auto-flip every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (item: SocialItem) => {
        if (item.action === "contact") {
            setIsContactDialogOpen(true);
        } else if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="relative z-10 flex flex-col pt-8 md:pt-4 xl:pt-6 pb-2 md:pb-1 px-6 md:px-4 xl:px-5">
            {/* Flipping Profile Image */}
            <div className="flex justify-center mb-2 md:mb-4">
                <div
                    className="relative w-24 h-24 md:w-20 md:h-20 xl:w-28 xl:h-28"
                    style={{ perspective: "1000px" }}
                >
                    <div
                        className={cn(
                            "relative w-full h-full transition-transform duration-700",
                            "[transform-style:preserve-3d]"
                        )}
                        style={{
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}
                    >
                        {/* Front - Real Photo */}
                        <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-zinc-900 [backface-visibility:hidden]">
                            <Image
                                src="/profile.webp"
                                alt="Roy Amit"
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                                quality={95}
                                priority
                            />
                        </div>

                        {/* Back - Ghibli Version */}
                        <div
                            className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-zinc-900 [backface-visibility:hidden]"
                            style={{ transform: "rotateY(180deg)" }}
                        >
                            <Image
                                src="/ghibli-developer.webp"
                                alt="Roy Amit - Ghibli Style"
                                width={200}
                                height={200}
                                className="object-cover w-full h-full scale-150 object-top"
                                quality={95}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Label */}
            <div className="mb-2 md:mb-1 text-center">
                <span className="inline-block text-[11px] md:text-[12px] xl:text-[14px] font-bold tracking-[0.2em] uppercase text-indigo-400">
                    Full-Stack Developer
                </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-2xl xl:text-3xl font-bold text-white mb-2 md:mb-2 tracking-tight text-center">
                Roy Amit
            </h1>

            {/* Bio */}
            <p className="text-sm md:text-base text-zinc-300 leading-snug md:leading-relaxed font-light mb-2 md:mb-2 text-center px-3">
                I've built this AI assistant from my projects and experiences.
                It's trained on my work to share my journey authentically.
                Chat with it to explore what I've learned along the way.
            </p>

            {/* Social Links */}
            <div
                id="tour-social-links"
                className="flex gap-5 md:gap-4 xl:gap-10 justify-center mb-3 md:mb-3 xl:mb-2"
            >
                {SOCIAL_ITEMS.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "group h-12 w-12 md:h-9 md:w-9 xl:h-11 xl:w-11 rounded-xl md:rounded-lg hover:text-indigo-400 active:text-indigo-400 hover:scale-[1.12] active:scale-[1.12] hover:shadow-lg active:shadow-lg transition-all duration-300",
                            tourStep?.targetId === "tour-social-links" && "relative z-50 text-indigo-400"
                        )}
                        onClick={() => handleClick(item)}
                        aria-label={item.label}
                    >
                        <item.icon className="size-6 md:size-7" />
                        <span className="sr-only">{item.label}</span>
                    </Button>
                ))}
            </div>

            {/* Gradient Separator */}
            <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>
    )
}
