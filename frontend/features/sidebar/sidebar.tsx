"use client"

import {Code2, Briefcase, FileText} from "lucide-react"
import type {Topic} from "@/lib/types"
import {useChatContext} from "@/features/chat/context/chat-context"

import {ProfileHeader} from "./components/profile-header"
import {NavigationMenu} from "./components/navigation-menu"
import {ClearChatButton} from "./components/clear-chat-button"
import {SocialLinks} from "./components/social-links"

const TOPICS = [
    {id: "projects" as Topic, label: "Projects", icon: Code2},
    {id: "skills" as Topic, label: "Skills", icon: Briefcase},
    {id: "resume" as Topic, label: "Resume", icon: FileText},
] as const

export function Sidebar() {
    const {isSidebarOpen} = useChatContext();

    return (
        <aside
            className={`
                fixed top-0 left-0 h-full w-64 lg:w-80 
                border-r border-white/10 
                bg-zinc-900 
                flex flex-col z-40 transform 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                `}
        >
            <ProfileHeader/>
            <NavigationMenu topics={TOPICS}/>
            <ClearChatButton/>
            <SocialLinks/>
        </aside>
    )
}
