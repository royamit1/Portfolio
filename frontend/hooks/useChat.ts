import {useState, useEffect, useCallback, useRef} from "react";
import type {Message} from "@/lib/types";
import {getSessionId} from "@/services/api";
import {useTypewriter} from "./use-typewriter";

async function streamChat(
    request: { message: string; session_id: string },
    onChunk: (chunk: string) => void,
    onEnd: () => void
): Promise<void> {
    const response = await fetch(`http://localhost:8000/api/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({detail: 'An unknown error occurred.'}));
        throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Something went wrong'}`);
    }

    if (!response.body) throw new Error("Response body is empty.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    try {
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            onChunk(decoder.decode(value, {stream: true}));
        }
    } finally {
        onEnd();
    }
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const streamingMessageId = useRef<string | null>(null);

    const handleRender = useCallback((text: string) => {
        if (!streamingMessageId.current) return;
        setMessages(prev =>
            prev.map(msg =>
                msg.id === streamingMessageId.current
                    ? {...msg, content: msg.content + text}
                    : msg
            )
        );
    }, []);

    const handleComplete = useCallback(() => {
        streamingMessageId.current = null;
    }, []);

    const {start, append, finish} = useTypewriter({
        onRender: handleRender,
        onComplete: handleComplete,
    });

    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;
        finish();

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        };

        const aiMessageId = Date.now().toString() + "-ai";
        streamingMessageId.current = aiMessageId;
        const aiMessagePlaceholder: Message = {
            id: aiMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage, aiMessagePlaceholder]);
        setIsLoading(true);
        start();

        try {
            let isFirstChunk = true;
            await streamChat(
                {message: content, session_id: sessionId},
                (chunk) => {
                    if (isFirstChunk) {
                        setIsLoading(false);
                        isFirstChunk = false;
                    }
                    append(chunk);
                },
                () => {
                    finish();
                }
            );
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId
                    ? {...msg, content: "Sorry, something went wrong. Please try again."}
                    : msg
            ));
            finish();
            setIsLoading(false);
        }
    }, [sessionId, start, append, finish]);

    // The context no longer needs a separate displayText
    return {messages, isLoading, sendMessage, setMessages};
}
