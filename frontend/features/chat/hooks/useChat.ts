"use client"

import {useState, useEffect, useCallback, useRef} from "react";
import type {Message, ToolLog} from "@/lib/types";
import {getSessionId} from "@/services/api";
import {streamChatService} from "@/features/chat/lib/chat-stream";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentToolLog, setCurrentToolLog] = useState<ToolLog | null>(null);
    const [sessionId, setSessionId] = useState("");

    // Used to cancel in-flight requests if the user navigates away or sends a new message quickly
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setSessionId(getSessionId());
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        // Cancel previous request to prevent race conditions
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

        // Optimistic update
        setMessages(prev => [...prev, userMessage, aiMessagePlaceholder]);
        setIsLoading(true);
        setCurrentToolLog(null);

        await streamChatService(
            {message: content, session_id: sessionId},
            {
                onToken: (token) => {
                    // Clear tool logs once text starts streaming
                    setCurrentToolLog(null);
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMessagePlaceholder.id
                                ? {...msg, content: msg.content + token}
                                : msg
                        )
                    );
                },
                onToolStart: (tool, message) => {
                    setCurrentToolLog({tool, message, status: 'loading'});
                },
                onToolEnd: (tool, message) => {
                    setCurrentToolLog({tool, message, status: 'success'});
                },
                onError: (errorMessage) => {
                    setCurrentToolLog({tool: 'error', message: errorMessage, status: 'error'});
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

    // Wrapper to ensure tool logs are cleared when messages are manually updated (e.g., clearing chat)
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