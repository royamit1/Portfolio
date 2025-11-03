"use client"

import {useState} from "react"
import {toast} from "sonner"
import {Sidebar} from "@/app/components/sidebar/sidebar"
import {ChatWindow} from "@/app/components/chat/chat-window"
import {GreetingBanner} from "@/app/components/chat/features/greeting-banner"
import {MagicWordsController} from "@/app/components/chat/features/magic-words-controller"
import {ContactForm, type ContactFormData} from "@/app/components/sidebar/contact-dialog"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/app/components/ui/dialog"
import type {Message, Topic} from "@/app/lib/types"
import {PanelLeft} from "lucide-react"

// This is now a "dumb" presentational component.
// It receives all its data and functions as props.
interface ChatLayoutProps {
    messages: Message[];
    isTyping: boolean;
    showBanner: boolean;
    isSidebarOpen: boolean;
    isContactDialogOpen: boolean;
    onTopicSelect: (topic: Topic) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsContactDialogOpen: (isOpen: boolean) => void;
}

export function ChatLayout({
                               messages,
                               isTyping,
                               showBanner,
                               isSidebarOpen,
                               isContactDialogOpen,
                               onTopicSelect,
                               onSendMessage,
                               onClearChat,
                               onContactSubmit,
                               setIsSidebarOpen,
                               setIsContactDialogOpen,
                           }: ChatLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <MagicWordsController messages={messages}/>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onTopicSelect={onTopicSelect}
                onClearChat={onClearChat}
                onOpenContact={() => setIsContactDialogOpen(true)}
            />

            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex items-center gap-4 px-4 py-3 border-b lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1">
                        <PanelLeft className="h-6 w-6"/>
                    </button>
                    <h1 className="text-lg font-semibold">Roy Amit</h1>
                </header>
                <ChatWindow
                    messages={messages}
                    isTyping={isTyping}
                    showBanner={showBanner}
                    banner={<GreetingBanner onTopicSelect={onTopicSelect}/>}
                    onSendMessage={onSendMessage}
                />
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
