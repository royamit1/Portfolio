"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import type { Message, ToolLog } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import { streamChatService } from "@/features/chat/lib/chat-stream";
import { toast } from "sonner";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentToolLog, setCurrentToolLog] = useState<ToolLog | null>(null);
    const [sessionId, setSessionId] = useState("");

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setSessionId(getSessionId());
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        abortControllerRef.current?.abort();
        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        };

        const aiMessagePlaceholder: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, aiMessagePlaceholder]);
        setIsLoading(true);
        setCurrentToolLog(null);

        await streamChatService(
            { message: content, session_id: sessionId },
            {
                onToken: (token) => {
                    setCurrentToolLog(null);
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMessagePlaceholder.id
                                ? { ...msg, content: msg.content + token }
                                : msg
                        )
                    );
                },
                onToolStart: (tool, message) => {
                    setCurrentToolLog({ tool, message, status: 'loading' });
                },
                onToolEnd: (tool, message) => {
                    setCurrentToolLog({ tool, message, status: 'success' });
                },
                onError: (errorMessage, isRateLimit) => {
                    if (isRateLimit) {
                        // Show toast & remove the user's message that triggered the limit
                        toast.error(errorMessage);
                        setMessages(prev => prev.slice(0, -2)); // Remove user msg + AI placeholder
                    } else {
                        setCurrentToolLog({ tool: 'error', message: errorMessage, status: 'error' });
                    }
                    setIsLoading(false);
                },
                onDone: () => {
                    setCurrentToolLog(null);
                    setIsLoading(false);
                    if (abortControllerRef.current === newAbortController) {
                        abortControllerRef.current = null;
                    }
                }
            },
            newAbortController.signal
        );

    }, [sessionId, isLoading]);

    // Clears tool logs when messages are manually cleared
    const setMessagesWrapper = useCallback((value: Message[] | ((prev: Message[]) => Message[])) => {
        if (typeof value === 'function') {
            setMessages(value);
        } else {
            setMessages(value);
            setCurrentToolLog(null);
        }
    }, []);

    return {
        messages,
        isLoading,
        currentToolLog,
        sendMessage,
        setMessages: setMessagesWrapper,
        setCurrentToolLog
    };
}