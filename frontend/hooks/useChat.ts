import {useState, useEffect, useCallback, useRef} from "react";
import type {Message, ToolLog} from "@/lib/types";
import {getSessionId} from "@/services/api";
import {streamChatService} from "@/services/chat-stream";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentToolLog, setCurrentToolLog] = useState<ToolLog | null>(null);
    const [sessionId, setSessionId] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);

    // Track if we've cleared the log to avoid flickering
    const hasClearedToolLog = useRef(false);

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
        hasClearedToolLog.current = false;

        await streamChatService(
            {message: content, session_id: sessionId},
            {
                onToken: (token) => {
                    if (!hasClearedToolLog.current) {
                        setCurrentToolLog(null);
                        hasClearedToolLog.current = true;
                    }

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMessagePlaceholder.id
                                ? {...msg, content: msg.content + token}
                                : msg
                        )
                    );
                },
                onToolStart: (tool, message) => {
                    hasClearedToolLog.current = false;
                    setCurrentToolLog({tool, message, status: 'loading'});
                },
                onToolEnd: (tool, message) => {
                    setCurrentToolLog({tool, message, status: 'success'});
                    // Fallback clear
                    setTimeout(() => setCurrentToolLog(null), 2500);
                },
                onError: (errorMessage) => {
                    setCurrentToolLog({tool: 'error', message: errorMessage, status: 'error'});
                    setIsLoading(false);
                },
                onDone: () => {
                    setIsLoading(false);
                    if (abortControllerRef.current === newAbortController) {
                        abortControllerRef.current = null;
                    }
                }
            },
            newAbortController.signal
        );

    }, [sessionId, isLoading]);

    return {messages, isLoading, currentToolLog, sendMessage, setMessages};
}