"use client"

import { cn } from "@/lib/utils"
import { useChatContext } from "@/features/chat/context/chat-context"
import { Code2, Briefcase, FileText } from "lucide-react"
import { ProfileHeader } from "./components/profile-header"
import { NavigationMenu } from "./components/navigation-menu"
import { NewChatButton } from "./components/new-chat-button"
import type { Topic } from "@/lib/types"

const TOPICS = [
    { id: "projects" as Topic, label: "Explore Projects", icon: Code2 },
    { id: "skills" as Topic, label: "Tech Stack", icon: Briefcase },
    { id: "resume" as Topic, label: "View Resume", icon: FileText },
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
                "fixed top-0 left-0 h-[100dvh] w-80 lg:w-96",
                "border-r border-white/10 bg-zinc-900",
                "flex flex-col z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent",
                "transition-transform duration-300 ease-in-out",

                // Elevate z-index when sidebar elements are tour targets
                (tourStep?.targetId === "sidebar-wrapper" || isSidebarTarget) && "z-50",

                tourStep?.targetId === "sidebar-wrapper" && "spotlight-active shadow-2xl",

                // Mobile: drawer behavior
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                // Desktop: always visible
                "lg:relative lg:translate-x-0"
            )}
        >
            <ProfileHeader />
            <NewChatButton />
            <NavigationMenu topics={TOPICS} />
        </aside>
    )
}
