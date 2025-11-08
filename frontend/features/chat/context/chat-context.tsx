'use client';

import React, {createContext, useContext, useState, useRef, useCallback, ReactNode} from 'react';
import {toast} from 'sonner';
import {useChat} from "@/hooks/useChat";
import type {Message, Topic} from '@/lib/types';
import type {ContactFormData} from '@/features/contact';

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    showBanner: boolean;
    isSidebarOpen: boolean;
    isContactDialogOpen: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onTopicSelect: (topic: Topic) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsContactDialogOpen: (isOpen: boolean) => void;
    scrollToBottom: (behavior?: "smooth" | "auto") => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({children}: { children: ReactNode }) {
    const {messages, isLoading, sendMessage, setMessages} = useChat();
    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior});
    }, []);

    const handleTopicSelect = useCallback(async (topic: Topic) => {
        setShowBanner(false);
        setIsSidebarOpen(false);
        await sendMessage(`Tell me about your ${topic}.`);
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
    }, [setMessages, setShowBanner, setIsSidebarOpen]);

    const handleContactSubmit = useCallback(async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_URL}/contact`, {
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
    }, [API_URL, setIsContactDialogOpen]);

    const value = {
        messages,
        isLoading,
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
