"use client"

import React from "react"
import {Sidebar} from "@/features/sidebar"
import {ChatWindow} from "./components/chat-window"
import {GreetingBanner} from "./components/greeting-banner"
import {ContactForm} from "@/features/contact"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import {PanelLeft} from "lucide-react"
import {useChatContext} from "./context/chat-context"

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
        <div className="flex h-screen overflow-hidden bg-background">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidebar/>

            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex items-center gap-4 px-4 py-3 border-b lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1" aria-label="Toggle sidebar">
                        <PanelLeft className="h-6 w-6"/>
                    </button>
                    <h1 className="text-lg font-semibold">Roy Amit</h1>
                </header>
                <ChatWindow banner={<GreetingBanner onTopicSelect={onTopicSelect}/>}/>
            </main>

            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="max-w-2xl w-full p-0 border-none bg-transparent shadow-none animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Contact Form</DialogTitle>
                        <DialogDescription>Send me a message and I&#39;ll get back to you soon.</DialogDescription>
                    </DialogHeader>
                    <ContactForm onSubmit={onContactSubmit}/>
                </DialogContent>
            </Dialog>
        </div>
    );
}
