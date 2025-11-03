// src/hooks/useChat.ts
import {useState} from "react"
import type {Message} from "@/app/lib/types"

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)

    async function sendMessage(content: string) {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        try {
            const res = await fetch("http://127.0.0.1:8000/ask", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question: content}),
            })

            const data = await res.json()

            const aiMessage: Message = {
                id: Date.now().toString() + "-ai",
                role: "assistant",
                content: data.answer,
                timestamp: new Date(),
                // we can detect project-related answers here if needed
                showProjectCards: content.toLowerCase().includes("project"),
                showSkillsGrid: content.toLowerCase().includes("skills"),
                showResume: content.toLowerCase().includes("resume"),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (err) {
            console.error("Chat error:", err)
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "-err",
                    role: "assistant",
                    content: "Error contacting backend.",
                    timestamp: new Date(),
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    return {messages, isTyping, sendMessage, setMessages}
}
