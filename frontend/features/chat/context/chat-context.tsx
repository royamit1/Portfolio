'use client';

import React, {createContext, useContext, useState, useRef, useCallback, ReactNode} from 'react';
import {toast} from 'sonner';
import {useChat} from "@/hooks/useChat";
import type {Message, ToolLog} from '@/lib/types';
import type {ContactFormData} from '@/features/contact';
import {HEALTH_URL, API_BASE_URL} from "@/services/api";

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    currentToolLog: ToolLog | null;
    showBanner: boolean;
    isSidebarOpen: boolean;
    isContactDialogOpen: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onTopicSelect: (prompt: string) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsContactDialogOpen: (isOpen: boolean) => void;
    scrollToBottom: (behavior?: "smooth" | "auto") => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({children}: { children: ReactNode }) {
    const {messages, isLoading, currentToolLog, sendMessage, setMessages, setCurrentToolLog} = useChat();

    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        fetch(HEALTH_URL, {method: 'HEAD'}).catch(() => {
            console.log("Backend wake-up ping failed (expected if offline)");
        });
    }, []);

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior});
    }, []);

    const handleTopicSelect = useCallback(async (prompt: string) => {
        setShowBanner(false);
        setIsSidebarOpen(false);
        await sendMessage(prompt);
        scrollToBottom('auto');
    }, [sendMessage, setIsSidebarOpen, setShowBanner, scrollToBottom]);

    const handleSendMessage = useCallback(async (content: string) => {
        setShowBanner(false);
        await sendMessage(content);
    }, [sendMessage]);

    const handleClearChat = useCallback(() => {
        setMessages([]);
        setShowBanner(true);
        setIsSidebarOpen(false);
        setCurrentToolLog(null);
    }, [setMessages, setShowBanner, setIsSidebarOpen, setCurrentToolLog]);

    const handleContactSubmit = useCallback(async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Response not OK');
            toast.success('Message sent successfully! ✅');
            setIsContactDialogOpen(false);
        } catch (error) {
            toast.error('Failed to send message. Please try again. ❌');
            console.error(error);
        }
    }, [setIsContactDialogOpen]);

    const value = {
        messages,
        isLoading,
        currentToolLog,
        showBanner,
        isSidebarOpen,
        isContactDialogOpen,
        scrollRef,
        onTopicSelect: handleTopicSelect,
        onSendMessage: handleSendMessage,
        onClearChat: handleClearChat,
        onContactSubmit: handleContactSubmit,
        setIsSidebarOpen,
        setIsContactDialogOpen,
        scrollToBottom,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}