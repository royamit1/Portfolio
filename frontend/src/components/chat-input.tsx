"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const MIN_HEIGHT = 57
    const MAX_HEIGHT = 220

    useEffect(() => {
        if (textareaRef.current) {
            // Reset height to get accurate scrollHeight
            textareaRef.current.style.height = `${MIN_HEIGHT}px`
            const scrollHeight = textareaRef.current.scrollHeight

            // Grow up to max height, then enable scrollbar
            if (scrollHeight <= MAX_HEIGHT) {
                textareaRef.current.style.height = `${scrollHeight}px`
                textareaRef.current.style.overflowY = "hidden"
            } else {
                textareaRef.current.style.height = `${MAX_HEIGHT}px`
                textareaRef.current.style.overflowY = "auto"
            }
        }
    }, [input])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !disabled) {
            onSendMessage(input.trim())
            setInput("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end rounded-4xl border border-input bg-card shadow-sm transition-all hover:shadow-md">
        <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about my work..."
            disabled={disabled}
            rows={1}
            className="w-full text-gray-200 resize-none rounded-4xl bg-chat-input-bg content-center pl-6 pr-20 text-[16px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            style={{
                minHeight: `${MIN_HEIGHT}px`,
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(100 116 139) transparent",
            }}
        />
                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute right-3 bottom-2.5 h-9 w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100"
                >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}
