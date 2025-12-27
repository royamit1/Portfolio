"use client"

import {Button} from "@/components/ui/button"
import {FaGithub, FaLinkedin, FaEnvelope} from "react-icons/fa"
import type {IconType} from "react-icons"
import {useChatContext} from "@/features/chat/context/chat-context"

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
    const {setIsContactDialogOpen} = useChatContext();

    const handleClick = (item: SocialItem) => {
        if (item.action === "contact") {
            setIsContactDialogOpen(true);
        } else if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="flex gap-3 md:gap-4 justify-center p-4 md:p-5">
            {SOCIAL_ITEMS.map((item, index) => (
                <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="group h-12 w-12 md:h-14 md:w-14 rounded-lg hover:text-indigo-400 active:text-indigo-400 hover:scale-[1.12] active:scale-[1.12] hover:shadow-lg active:shadow-lg transition-all duration-300 [&_svg]:size-5 md:[&_svg]:size-6"
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
