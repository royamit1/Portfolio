"use client"

import { cn } from "@/lib/utils"
import { useChatContext } from "@/features/chat/context/chat-context"
import { Code2, Briefcase, FileText } from "lucide-react"
import { ProfileHeader } from "./components/profile-header"
import { NavigationMenu } from "./components/navigation-menu"
import { ClearChatButton } from "./components/clear-chat-button"
import { SocialLinks } from "./components/social-links"
import type { Topic } from "@/lib/types"

const TOPICS = [
    { id: "projects" as Topic, label: "View Projects", icon: Code2 },
    { id: "skills" as Topic, label: "Tech Stack", icon: Briefcase },
    { id: "resume" as Topic, label: "Download Resume", icon: FileText },
] as const

const SIDEBAR_TARGET_IDS = [
    "sidebar-wrapper",
    "tour-social-links",
    "tour-topic-projects",
    "tour-topic-skills",
    "tour-topic-resume",
    "tour-clear-chat"
];

export function Sidebar() {
    const { isSidebarOpen, tourStep } = useChatContext();

    const isSidebarTarget = tourStep && SIDEBAR_TARGET_IDS.includes(tourStep.targetId);

    return (
        <aside
            id="sidebar-wrapper"

            className={cn(
                "fixed top-0 left-0 h-full w-64 lg:w-80",
                "border-r border-white/10 bg-zinc-900",
                "flex flex-col z-40",
                "transition-transform duration-300 ease-in-out",

                // Elevate sidebar if any internal element is targeted
                (tourStep?.targetId === "sidebar-wrapper" || isSidebarTarget) && "z-50",

                // Apply spotlight effect only when the sidebar itself is the target
                tourStep?.targetId === "sidebar-wrapper" && "spotlight-active shadow-2xl",

                // Mobile State (Drawer behavior)
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",

                // Desktop State (Always visible, resets transform)
                "lg:relative lg:translate-x-0"
            )}
        >
            <ProfileHeader />
            <NavigationMenu topics={TOPICS} />
            <ClearChatButton />
            <SocialLinks />
        </aside>
    )
}