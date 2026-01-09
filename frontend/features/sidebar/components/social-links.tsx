"use client"

import {Button} from "@/components/ui/button"
import {FaGithub, FaLinkedin, FaEnvelope} from "react-icons/fa"
import {useChatContext} from "@/features/chat/context/chat-context"
import {cn} from "@/lib/utils"
import type {IconType} from "react-icons"

interface SocialItem {
    icon: IconType
    label: string
    url?: string
    action?: "contact"
}

const SOCIAL_ITEMS: SocialItem[] = [
    {icon: FaGithub, label: "GitHub", url: "https://github.com/royamit1"},
    {icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/royamit1/"},
    {icon: FaEnvelope, label: "Email", action: "contact"}
]

export function SocialLinks() {
    const {setIsContactDialogOpen, tourStep} = useChatContext();

    const handleClick = (item: SocialItem) => {
        if (item.action === "contact") {
            setIsContactDialogOpen(true);
        } else if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div
            id="tour-social-links"
            className={cn(
                "flex w-full gap-8 justify-center p-4 md:p-5 border-t border-white/5 bg-black/20 transition-all duration-300",
            )}
        >
            {SOCIAL_ITEMS.map((item, index) => (
                <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "group h-10 w-10 md:h-12 md:w-12 rounded-lg hover:text-indigo-400 active:text-indigo-400 hover:scale-[1.12] active:scale-[1.12] hover:shadow-lg active:shadow-lg transition-all duration-300 [&_svg]:size-5 md:[&_svg]:size-6",
                        // Tour logic: Scale up significantly and bring to front, NO border/glow
                        tourStep?.targetId === "tour-social-links" && "relative z-50 text-indigo-400"
                    )}
                    onClick={() => handleClick(item)}
                    aria-label={item.label}
                >
                    <item.icon className="size-5 md:size-6"/>
                    <span className="sr-only">{item.label}</span>
                </Button>
            ))}
        </div>
    )
}