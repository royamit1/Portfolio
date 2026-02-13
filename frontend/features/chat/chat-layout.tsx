"use client"

import { PanelLeft } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { Sidebar } from "@/features/sidebar"
import { ChatWindow } from "./components/chat-window"
import { GreetingBanner } from "./components/greeting-banner"
import { ContactForm } from "@/features/contact"
import { useChatContext } from "./context/chat-context"
import { TourGuideOverlay } from "@/components/ui/tour-guide-overlay"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

export function ChatLayout() {
    const {
        isSidebarOpen,
        isContactDialogOpen,
        setIsSidebarOpen,
        setIsContactDialogOpen,
        onContactSubmit,
        onTopicSelect,
    } = useChatContext();

    return (
        // 100dvh ensures the layout fits the actual visible screen on mobile browsers
        // preventing the address bar from covering the chat input.
        <div className="flex h-[100dvh] overflow-hidden bg-background">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar />

            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex items-center gap-4 px-4 py-3 border-b lg:hidden shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1 hover:bg-accent rounded-md transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeft className="h-6 w-6" />
                    </button>
                    <span className="text-xl tracking-wide">
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-black italic pr-1">AI</span>
                        <span className="text-white/80 ml-1 font-light">Portfolio</span>
                    </span>

                    {/* Quick Access Buttons */}
                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => window.open("https://github.com/royamit1", "_blank", "noopener,noreferrer")}
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400/80 transition-all active:bg-indigo-500/10 active:border-indigo-500/20 active:text-indigo-400 active:scale-95"
                            aria-label="GitHub Profile"
                        >
                            <FaGithub className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => window.open("https://www.linkedin.com/in/royamit1/", "_blank", "noopener,noreferrer")}
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400/80 transition-all active:bg-indigo-500/10 active:border-indigo-500/20 active:text-indigo-400 active:scale-95"
                            aria-label="LinkedIn Profile"
                        >
                            <FaLinkedin className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onTopicSelect("resume")}
                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400/80 transition-all active:bg-indigo-500/10 active:border-indigo-500/20 active:text-indigo-400 active:scale-95"
                            aria-label="View Resume"
                        >
                            <span className="font-black text-sm leading-none tracking-tight">CV</span>
                        </button>
                    </div>
                </header>

                <ChatWindow
                    banner={<GreetingBanner onTopicSelect={onTopicSelect} />}
                />
            </main>

            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogContent
                    // Prevent autofocus to avoid virtual keyboard popping up immediately on mobile
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    showCloseButton={false}
                    className="max-w-2xl w-full p-0 border-none bg-transparent shadow-none animate-in fade-in-0 zoom-in-95 duration-200"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Contact Form</DialogTitle>
                        <DialogDescription>Send me a message and I'll get back to you soon.</DialogDescription>
                    </DialogHeader>

                    <ContactForm onSubmit={onContactSubmit} onClose={() => setIsContactDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <TourGuideOverlay />
        </div>
    );
}