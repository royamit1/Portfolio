"use client"

import React, {useState, useRef, useLayoutEffect, useEffect} from "react"
import {Button} from "@/app/components/ui/button"
import {ArrowUp} from "lucide-react"
import {CommandPalette} from "@/app/components/chat/features/command-palette"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24,
    MAX_HEIGHT: 200,
};

export function ChatInput({onSendMessage, disabled}: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // --- DERIVED STATE ---
    const isCommandPaletteOpen = input.startsWith("/") && !input.includes(" ");
    const commandQuery = isCommandPaletteOpen ? input.substring(1).toLowerCase() : "";

    // Re-focus the input whenever it becomes enabled
    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus();
        }
    }, [disabled]);

    // Resize textarea based on content
    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "auto"
        const newHeight = Math.min(Math.max(textarea.scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
    }, [input])

    const handleCommandSelect = (command: string) => {
        setInput(command + " ")
        textareaRef.current?.focus()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || disabled) return
        onSendMessage(input.trim())
        setInput("")
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Let the CommandPalette handle Enter, ArrowUp, ArrowDown if it's open
        if (isCommandPaletteOpen) {
            if (e.key === "Escape") {
                setInput("");
            }
            return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            {isCommandPaletteOpen && (
                <CommandPalette
                    key={commandQuery} // This is the key to resetting the state
                    query={commandQuery}
                    onSelect={handleCommandSelect}
                />
            )}
            <div
                className="relative flex items-end rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg shadow-sm pl-4 md:pl-6 pr-12 md:pr-14"
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything or type / for commands..."
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none bg-transparent text-sm md:text-base text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full py-3 md:py-4"
                    style={{
                        minHeight: `${CONFIG.MIN_HEIGHT}px`,
                        maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                        paddingRight: '8px',
                        scrollbarGutter: 'stable',
                    }}
                />

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute bg-indigo-400 right-2.5 bottom-2.5 md:bottom-3.5 h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}
