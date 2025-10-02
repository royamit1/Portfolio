import {useEffect, useRef, useState} from "react";
import type {Message} from "@/lib/types.ts";
import {askBackend} from "@/services/api";
import {v4 as uuidv4} from "uuid";

const STORAGE_KEY = "portfolio_chat_history_v1";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Message[];
                setMessages(parsed);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
                setMessages([]);
            }
        }
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const send = async (text: string) => {
        const userMsg: Message = {
            id: uuidv4(),
            role: "user",
            text,
            createdAt: Date.now(),
        };
        setMessages((m) => [...m, userMsg]);

        setIsTyping(true);

        // ask backend
        const replyText = await askBackend(text);

        if (!mountedRef.current) return;
        const botMsg: Message = {
            id: uuidv4(),
            role: "bot",
            text: replyText,
            createdAt: Date.now(),
        };
        setMessages((m) => [...m, botMsg]);
        setIsTyping(false);
    };

    const clear = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {messages, send, isTyping, clear, setMessages};
}
