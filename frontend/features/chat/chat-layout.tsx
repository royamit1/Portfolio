"use client"

import React from "react"
import { PanelLeft } from "lucide-react"
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
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
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
                    <h1 className="text-lg font-semibold">Roy Amit</h1>
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