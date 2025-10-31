"use client"

import React, {useState, useRef, useLayoutEffect} from "react"
import {Button} from "@/components/ui/button.tsx"
import {ArrowUp} from "lucide-react"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24, // Single-row height in px
    MAX_HEIGHT: 200, // Max height with scrollbar in px
    PADDING_Y_DESKTOP: 32, // Total vertical padding for desktop
    PADDING_Y_MOBILE: 24, // Total vertical padding for mobile
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
                className="relative flex items-end rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg shadow-sm py-3 md:py-4 pl-4 md:pl-6 pr-12 md:pr-14 text-base leading-relaxed text-gray-200 overflow-hidden"
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none bg-transparent text-base leading-relaxed text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
                    style={{
                        minHeight: `${CONFIG.MIN_HEIGHT}px`,
                        maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                        padding: 0,
                        paddingRight: '8px',
                        scrollbarGutter: 'stable',
                    }}
                />

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute bg-indigo-400 right-2.5 bottom-2 h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}