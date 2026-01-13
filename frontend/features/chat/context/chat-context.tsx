'use client';

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useChat } from "@/features/chat/hooks/useChat";
import type { Message, ToolLog, Topic } from '@/lib/types';
import type { ContactFormData } from '@/features/contact';
import { HEALTH_URL, API_BASE_URL } from "@/services/api";
import { v4 as uuidv4 } from 'uuid';

export interface TourStep {
    targetId: string;       // The ID of the HTML element to highlight (e.g., "sidebar-wrapper")
    message: string;        // The text to display in the popup
    placement: "top" | "bottom" | "left" | "right" | "center"; // Where to put the popup

    // NEW: Optional override for the popup's anchor element.
    // If provided, the popup will position itself relative to THIS element,
    // even though 'targetId' is the one glowing.
    popupAnchorId?: string;
}

interface ChatContextType {
    // --- Data State ---
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isLoading: boolean;
    currentToolLog: ToolLog | null;

    // --- Input State (Lifted for Tour "Ghost Typing") ---
    inputText: string;
    setInputText: React.Dispatch<React.SetStateAction<string>>;

    // Spotlight State
    tourStep: TourStep | null;
    setTourStep: (step: TourStep | null) => void;

    // --- UI State ---
    showBanner: boolean;
    setShowBanner: (show: boolean) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isContactDialogOpen: boolean;
    setIsContactDialogOpen: (isOpen: boolean) => void;
    activeTopic: Topic | null;
    setActiveTopic: (topic: Topic | null) => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;

    // --- Actions ---
    onTopicSelect: (topic: Topic | string) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    scrollToBottom: (behavior?: "smooth" | "auto") => void;
}

// User-friendly labels for the visual topics
const TOPIC_LABELS: Record<string, string> = {
    projects: "Show me your projects 🚀",
    skills: "What are your technical skills? 💻",
    resume: "I'd like to see your resume 📄"
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { messages, isLoading, currentToolLog, sendMessage, setMessages, setCurrentToolLog } = useChat();

    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
    const [inputText, setInputText] = useState("");
    const [tourStep, setTourStep] = useState<TourStep | null>(null);
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
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
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
            // We set the input text to show what's happening, then send
            setInputText(topicOrPrompt);
            await sendMessage(topicOrPrompt);
            setInputText("");
            scrollToBottom('auto');
        }
    }, [sendMessage, setIsSidebarOpen, setShowBanner, scrollToBottom, setMessages]);

    const handleSendMessage = useCallback(async (content: string) => {
        setShowBanner(false);
        setActiveTopic(null);
        setInputText("");
        await sendMessage(content);
    }, [sendMessage]);

    const handleClearChat = useCallback(() => {
        setMessages([]);
        setShowBanner(true);
        setIsSidebarOpen(false);
        setCurrentToolLog(null);
        setActiveTopic(null);
        setInputText("");
    }, [setMessages, setShowBanner, setIsSidebarOpen, setCurrentToolLog]);

    const handleContactSubmit = useCallback(async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Failed to send message. Please try again. ❌');
                throw new Error('Failed to send message');
            }

            toast.success('Message sent successfully! ✅');
            setIsContactDialogOpen(false);
        } catch (error) {
            toast.error('Failed to send message. Please try again. ❌');
            console.error(error);
            throw error; // Re-throw so the form knows it failed
        }
    }, [setIsContactDialogOpen]);

    const value = {
        messages,
        setMessages,
        isLoading,
        currentToolLog,
        inputText,
        tourStep,
        setTourStep,
        setInputText,
        showBanner,
        setShowBanner,
        isSidebarOpen,
        setIsSidebarOpen,
        isContactDialogOpen,
        setIsContactDialogOpen,
        activeTopic,
        setActiveTopic,
        scrollRef,
        onTopicSelect: handleTopicSelect,
        onSendMessage: handleSendMessage,
        onClearChat: handleClearChat,
        onContactSubmit: handleContactSubmit,
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