"use client"

import {cn} from "@/lib/utils"
import {useChatContext} from "@/features/chat/context/chat-context"
import {Code2, Briefcase, FileText} from "lucide-react"
import {ProfileHeader} from "./components/profile-header"
import {NavigationMenu} from "./components/navigation-menu"
import {ClearChatButton} from "./components/clear-chat-button"
import {SocialLinks} from "./components/social-links"
import type {Topic} from "@/lib/types"

const TOPICS = [
    {id: "projects" as Topic, label: "Projects", icon: Code2},
    {id: "skills" as Topic, label: "Skills", icon: Briefcase},
    {id: "resume" as Topic, label: "Resume", icon: FileText},
] as const

export function Sidebar() {
    const {isSidebarOpen} = useChatContext()

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 h-full w-64 lg:w-80",
                "border-r border-white/10 bg-zinc-900",
                "flex flex-col z-40",
                "transition-transform duration-300 ease-in-out",

                // Mobile State (Drawer behavior)
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",

                // Desktop State (Always visible, resets transform)
                "lg:relative lg:translate-x-0"
            )}
        >
            <ProfileHeader/>
            <NavigationMenu topics={TOPICS}/>
            <ClearChatButton/>
            <SocialLinks/>
        </aside>
    )
}