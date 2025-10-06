"use client"

import {Code2, Briefcase, FileText} from "lucide-react"
import type {Topic} from "@/lib/types"

import {ProfileHeader} from "@/components/sidebar/profile-header"
import {NavigationMenu} from "@/components/sidebar/navigation-menu"
import {ClearChatButton} from "@/components/sidebar/clear-chat-button"
import {SocialLinks} from "@/components/sidebar/social-links"

const TOPICS = [
    {id: "projects" as Topic, label: "Projects", icon: Code2},
    {id: "skills" as Topic, label: "Skills", icon: Briefcase},
    {id: "resume" as Topic, label: "Resume", icon: FileText},
] as const

interface SidebarProps {
    onTopicSelect: (topic: Topic) => void
    onClearChat: () => void
}

export function Sidebar({onTopicSelect, onClearChat}: SidebarProps) {
    return (
        <aside className="w-64 lg:w-80 border-r border-sidebar-border bg-sidebar flex flex-col">
            <ProfileHeader/>
            <NavigationMenu topics={TOPICS} onTopicSelect={onTopicSelect}/>
            <ClearChatButton onClearChat={onClearChat}/>
            <SocialLinks/>
        </aside>
    )
}