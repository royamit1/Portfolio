"use client"

import type React from "react"

import {useState, useRef, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {ArrowUp} from "lucide-react"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

export function ChatInput({onSendMessage, disabled}: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
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
        <form onSubmit={handleSubmit}>
            <div className="relative flex items-center">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about my work..."
                    disabled={disabled}
                    rows={1}
                    className="w-full min-h-[51px] max-h-[200px] resize-none overflow-hidden rounded-3xl border border-input bg-card px-5 pr-14 py-3 text-[15px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all hover:shadow-md"
                />
                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute bottom-2 right-3 h-9 w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100 cursor-pointer"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}
