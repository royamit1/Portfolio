'use client';

import React, {createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect} from 'react';
import {toast} from 'sonner';
import {useChat} from "@/features/chat/hooks/useChat";
import type {Message, ToolLog, Topic} from '@/lib/types';
import type {ContactFormData} from '@/features/contact';
import {HEALTH_URL, API_BASE_URL} from "@/services/api";
import {v4 as uuidv4} from 'uuid';

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    currentToolLog: ToolLog | null;
    showBanner: boolean;
    isSidebarOpen: boolean;
    isContactDialogOpen: boolean;
    activeTopic: Topic | null;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onTopicSelect: (topic: Topic | string) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setIsContactDialogOpen: (isOpen: boolean) => void;
    setActiveTopic: (topic: Topic | null) => void;
    scrollToBottom: (behavior?: "smooth" | "auto") => void;
}

// User-friendly labels for the visual topics
const TOPIC_LABELS: Record<string, string> = {
    projects: "Show me your projects 🚀",
    skills: "What are your technical skills? 💻",
    resume: "I'd like to see your resume 📄"
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({children}: { children: ReactNode }) {
    const {messages, isLoading, currentToolLog, sendMessage, setMessages, setCurrentToolLog} = useChat();

    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Backend Wake-up / Health Check
    // Pings the backend on mount to wake up serverless instances (e.g. Render/Heroku)
    useEffect(() => {
        if (!HEALTH_URL) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        fetch(HEALTH_URL, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        })
            .then(() => {
                clearTimeout(timeoutId);
                console.log("Backend is awake.");
            })
            .catch(() => {
                // Ignore errors (timeouts or offline), this is just a best-effort wake-up
            });

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior});
        }, 100);
    }, []);

    const handleTopicSelect = useCallback(async (topicOrPrompt: Topic | string) => {
        setShowBanner(false);
        setIsSidebarOpen(false);

        // Check if the input corresponds to a visual component (projects, skills, resume)
        if (topicOrPrompt === "projects" || topicOrPrompt === "skills" || topicOrPrompt === "resume") {
            const topic = topicOrPrompt as Topic;

            // FAKE MESSAGE INJECTION:
            // Instead of sending this to the LLM, we manually construct the conversation history.
            // This forces the UI to render the specific component (Carousel/Grid/PDF) immediately.

            const userMsg: Message = {
                id: uuidv4(),
                role: 'user',
                content: TOPIC_LABELS[topic] || topic.charAt(0).toUpperCase() + topic.slice(1),
                timestamp: new Date(),
            };

            const assistantMsg: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: "",
                timestamp: new Date(),
                uiComponent: topic, // Triggers ChatBubble to render the visual tool
                isComplete: true
            };

            setMessages(prev => [...prev, userMsg, assistantMsg]);
            scrollToBottom('smooth');

        } else {
            // Standard text prompt processing via LLM
            setActiveTopic(null);
            await sendMessage(topicOrPrompt);
            scrollToBottom('auto');
        }
    }, [sendMessage, setIsSidebarOpen, setShowBanner, scrollToBottom, setMessages]);

    const handleSendMessage = useCallback(async (content: string) => {
        setShowBanner(false);
        setActiveTopic(null);
        await sendMessage(content);
    }, [sendMessage]);

    const handleClearChat = useCallback(() => {
        setMessages([]);
        setShowBanner(true);
        setIsSidebarOpen(false);
        setCurrentToolLog(null);
        setActiveTopic(null);
    }, [setMessages, setShowBanner, setIsSidebarOpen, setCurrentToolLog]);

    const handleContactSubmit = useCallback(async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Failed to send message. Please try again. ❌');
                return;
            }

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
        activeTopic,
        scrollRef,
        onTopicSelect: handleTopicSelect,
        onSendMessage: handleSendMessage,
        onClearChat: handleClearChat,
        onContactSubmit: handleContactSubmit,
        setIsSidebarOpen,
        setIsContactDialogOpen,
        setActiveTopic,
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