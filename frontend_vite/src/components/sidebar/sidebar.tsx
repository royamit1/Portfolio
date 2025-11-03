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
    isOpen: boolean
    onClose: () => void
    onTopicSelect: (topic: Topic) => void
    onClearChat: () => void
    onOpenContact: () => void
}

export function Sidebar({isOpen, onTopicSelect, onClearChat, onOpenContact}: SidebarProps) {
    return (
        <aside
            className={`fixed top-0 left-0 h-full w-64 lg:w-80 border-r border-sidebar-border bg-sidebar flex flex-col z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
            <ProfileHeader/>
            <NavigationMenu topics={TOPICS} onTopicSelect={onTopicSelect}/>
            <ClearChatButton onClearChat={onClearChat}/>
            <SocialLinks onOpenContact={onOpenContact}/>
        </aside>
    )
}