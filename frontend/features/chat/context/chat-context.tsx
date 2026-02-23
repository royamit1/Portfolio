'use client';

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useChat } from "@/features/chat/hooks/useChat";
import type { Message, ToolLog, Topic } from '@/lib/types';
import { TEMPLATE_MAP } from '@/features/chat/components/templates';
import type { ContactFormData } from '@/features/contact';
import { HEALTH_URL, API_BASE_URL } from "@/services/api";

import { getSessionId } from '@/lib/session';

interface TourStep {
    targetId: string;
    message: string;
    placement: "top" | "bottom" | "left" | "right" | "center";
    popupAnchorId?: string; // Optional anchor for popup positioning (defaults to targetId)
}

interface ChatContextType {
    // Data State
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isLoading: boolean;
    currentToolLog: ToolLog | null;

    // Input State
    inputText: string;
    setInputText: React.Dispatch<React.SetStateAction<string>>;

    // Tour State
    tourStep: TourStep | null;
    setTourStep: (step: TourStep | null) => void;

    // UI State
    isRestoringMessages: boolean;
    hasMessagesToRestore: boolean;
    showBanner: boolean;
    setShowBanner: (show: boolean) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isContactDialogOpen: boolean;
    setIsContactDialogOpen: (isOpen: boolean) => void;
    isComponentStreaming: boolean;
    setIsComponentStreaming: (is: boolean) => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;

    // Actions
    onTopicSelect: (topic: Topic | string) => void;
    onSendMessage: (content: string) => void;
    onClearChat: () => void;
    onContactSubmit: (data: ContactFormData) => void;
    scrollToBottom: (behavior?: "smooth" | "auto", force?: boolean) => void;
}

const TOPIC_LABELS: Record<string, string> = {
    projects: "Show me your projects 🚀",
    skills: "What are your technical skills? 💻",
    resume: "I'd like to see your resume 📄"
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const MESSAGES_EXPIRY_HOURS = 2;

export function ChatProvider({ children }: { children: ReactNode }) {
    const { messages, isLoading, currentToolLog, sendMessage, setMessages, setCurrentToolLog } = useChat();

    const [isRestoringMessages, setIsRestoringMessages] = useState(true);
    const [hasMessagesToRestore, setHasMessagesToRestore] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [tourStep, setTourStep] = useState<TourStep | null>(null);
    const [isComponentStreaming, setIsComponentStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Restore messages from localStorage on mount
    useEffect(() => {
        const startTime = Date.now();
        const MIN_SPLASH_DURATION = 2000;

        const loadMessages = async () => {
            const sessionId = getSessionId();
            if (!sessionId) {
                await new Promise(resolve => setTimeout(resolve, MIN_SPLASH_DURATION));
                setIsRestoringMessages(false);
                return;
            }

            const storageKey = `chat_messages_${sessionId}`;
            const stored = localStorage.getItem(storageKey);

            if (stored) {
                try {
                    const { messages: savedMessages, timestamp } = JSON.parse(stored);
                    const expiryMs = MESSAGES_EXPIRY_HOURS * 60 * 60 * 1000;
                    if (Date.now() - timestamp < expiryMs && savedMessages.length > 0) {
                        // We have messages to restore
                        setHasMessagesToRestore(true);
                        setMessages(savedMessages);
                        setShowBanner(false);
                    } else {
                        // Expired - clear storage
                        localStorage.removeItem(storageKey);
                    }
                } catch (error) {
                    console.error('Failed to load messages from localStorage:', error);
                    localStorage.removeItem(storageKey);
                }
            }

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_SPLASH_DURATION - elapsedTime);

            await new Promise(resolve => setTimeout(resolve, remainingTime));
            setIsRestoringMessages(false);
        };

        loadMessages();
    }, []);

    // Persist messages to localStorage
    useEffect(() => {
        const sessionId = getSessionId();
        if (!sessionId) return;

        const storageKey = `chat_messages_${sessionId}`;
        if (messages.length === 0) {
            localStorage.removeItem(storageKey);
            return;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify({
                messages,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Failed to save messages to localStorage:', error);
        }
    }, [messages]);

    // Wake up serverless backend on mount
    useEffect(() => {
        if (!HEALTH_URL) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        fetch(HEALTH_URL, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        })
            .then(() => clearTimeout(timeoutId))
            .catch(() => {
                // Ignore errors (timeouts or offline), this is just a best-effort wake-up
            });

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth", force = false) => {
        setTimeout(() => {
            const container = scrollRef.current;
            if (!container) return;

            // Only auto-scroll if user is near the bottom (or forced)
            if (!force) {
                const { scrollTop, scrollHeight, clientHeight } = container;
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
                if (distanceFromBottom > 50) return;
            }

            container.scrollTo({ top: container.scrollHeight, behavior });
        }, 100);
    }, []);

    const handleTopicSelect = useCallback(async (topicOrPrompt: Topic | string) => {
        setShowBanner(false);
        setIsSidebarOpen(false);

        if (topicOrPrompt in TEMPLATE_MAP) {
            const templateKey = TEMPLATE_MAP[topicOrPrompt as keyof typeof TEMPLATE_MAP];

            const userMsg: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: topicOrPrompt,
                timestamp: new Date(),
            };

            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "",
                timestamp: new Date(),
                template: templateKey,
                isComplete: true
            };

            setMessages(prev => [...prev, userMsg, assistantMsg]);
            scrollToBottom('smooth', true);
            return;
        }

        // Visual topics render UI components directly without LLM call
        if (topicOrPrompt === "projects" || topicOrPrompt === "skills" || topicOrPrompt === "resume") {
            const topic = topicOrPrompt as Topic;
            const userMsg: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: TOPIC_LABELS[topic] || topic.charAt(0).toUpperCase() + topic.slice(1),
                timestamp: new Date(),
            };

            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "",
                timestamp: new Date(),
                uiComponent: topic,
                isComplete: true
            };

            setMessages(prev => [...prev, userMsg, assistantMsg]);
            scrollToBottom('smooth', true);

        } else {
            setInputText(topicOrPrompt);
            await sendMessage(topicOrPrompt);
            setInputText("");
            scrollToBottom('smooth', true);
        }
    }, [sendMessage, setIsSidebarOpen, setShowBanner, scrollToBottom, setMessages]);

    const handleSendMessage = useCallback(async (content: string) => {
        setShowBanner(false);
        setInputText("");
        scrollToBottom('smooth', true);
        await sendMessage(content);
    }, [sendMessage, scrollToBottom]);

    const handleClearChat = useCallback(() => {
        setMessages([]);
        setShowBanner(true);
        setIsSidebarOpen(false);
        setCurrentToolLog(null);
        setInputText("");

        const sessionId = getSessionId();
        if (sessionId) {
            const storageKey = `chat_messages_${sessionId}`;
            localStorage.removeItem(storageKey);
        }
    }, [setMessages, setShowBanner, setIsSidebarOpen, setCurrentToolLog]);

    const handleContactSubmit = useCallback(async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': getSessionId(), // Add session ID for per-user rate limiting
                },
                body: JSON.stringify(data),
            });

            if (response.status === 429) {
                toast.error("You've sent too many messages today. Please try again tomorrow. ⏱️");
                throw new Error('Rate limit exceeded');
            }

            if (!response.ok) {
                toast.error('Failed to send message. Please try again. ❌');
                throw new Error('Failed to send message');
            }

            toast.success('Message sent successfully! ✅');
            setIsContactDialogOpen(false);
        } catch (error) {
            if (error instanceof Error && error.message !== 'Rate limit exceeded') {
                toast.error('Failed to send message. Please try again. ❌');
            }
            throw error;
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
        isRestoringMessages,
        hasMessagesToRestore,
        showBanner,
        setShowBanner,
        isSidebarOpen,
        setIsSidebarOpen,
        isContactDialogOpen,
        setIsContactDialogOpen,
        scrollRef,
        onTopicSelect: handleTopicSelect,
        onSendMessage: handleSendMessage,
        onClearChat: handleClearChat,
        onContactSubmit: handleContactSubmit,
        isComponentStreaming,
        setIsComponentStreaming,
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