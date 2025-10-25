"use client"

import React, {useState, useRef, useLayoutEffect} from "react"
import {Button} from "@/components/ui/button.tsx"
import {ArrowUp} from "lucide-react"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 25, // Single-row height in px
    MAX_HEIGHT: 209, // Max height with scrollbar in px
    PADDING_Y: 32, // Total vertical padding (16px top + 16px bottom)
};


export function ChatInput({onSendMessage, disabled}: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.style.height = "auto"
        const scrollHeight = textarea.scrollHeight
        const newHeight = Math.min(Math.max(scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
    }, [input])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;
        try {
            setInput("");
            onSendMessage(input.trim());
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div
                className="relative flex items-end rounded-4xl border border-input bg-chat-input-bg shadow-sm py-4 pl-6 pr-20 text-[16px] leading-relaxed text-gray-200 overflow-hidden"
                style={{
                    minHeight: `${CONFIG.MIN_HEIGHT + CONFIG.PADDING_Y}px`, // Ensures initial single-row size
                    maxHeight: `${CONFIG.MAX_HEIGHT + CONFIG.PADDING_Y}px`, // Caps total height (content + padding)
                }}
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about my work..."
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none bg-transparent text-[16px] leading-relaxed text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
                    style={{
                        minHeight: `${CONFIG.MIN_HEIGHT}px`,
                        maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                        padding: 0, // Relies on container padding for spacing
                    }}
                />

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute bg-indigo-400 right-3 bottom-2.5 h-9 w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}