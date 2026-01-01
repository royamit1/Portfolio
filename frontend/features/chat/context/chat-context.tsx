'use client';

import React, {createContext, useContext, useState, useRef, useCallback, ReactNode} from 'react';
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

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({children}: { children: ReactNode }) {
    const {messages, isLoading, currentToolLog, sendMessage, setMessages, setCurrentToolLog} = useChat();

    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!HEALTH_URL) return;

        // Create an AbortController to timeout the request after 5 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        fetch(HEALTH_URL, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        })
            .then(() => {
                clearTimeout(timeoutId);
                console.log("Backend is awake and ready.");
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log("Backend wake-up signal sent (request timed out intentionally).");
                } else {
                    console.log("Backend wake-up ping failed (offline or DNS error).");
                }
            });

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        // Use setTimeout to ensure the DOM has updated with the new content before scrolling
        setTimeout(() => {
            scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior});
        }, 100);
    }, []);

    const handleTopicSelect = useCallback(async (topicOrPrompt: Topic | string) => {
        setShowBanner(false);
        setIsSidebarOpen(false);

        // Check if the input is one of our special topics
        if (topicOrPrompt === "projects" || topicOrPrompt === "skills" || topicOrPrompt === "resume") {
            // Instead of setting a global "activeTopic" state that replaces the view,
            // we inject a fake "assistant" message into the chat history that contains the UI component.

            const topic = topicOrPrompt as Topic;

            const TOPIC_LABELS: Record<string, string> = {
                projects: "Show me your projects 🚀",
                skills: "What are your technical skills? 💻",
                resume: "I'd like to see your resume 📄"
            };
            
            // 1. Add User Message (e.g., "Projects")
            const userMsg: Message = {
                id: uuidv4(),
                role: 'user',
                content: TOPIC_LABELS[topic] || topic.charAt(0).toUpperCase() + topic.slice(1),
                timestamp: new Date(),
            };
            
            // 2. Add Assistant Message with the UI Component
            const assistantMsg: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: "", // Empty content because the UI component is the main thing
                timestamp: new Date(),
                uiComponent: topic, // This tells the ChatBubble to render the component
                isComplete: true
            };

            setMessages(prev => [...prev, userMsg, assistantMsg]);
            scrollToBottom('smooth');
            
        } else {
            // It's a regular text prompt
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
                console.error('Response not OK');
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