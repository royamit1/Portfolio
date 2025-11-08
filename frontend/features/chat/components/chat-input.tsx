"use client"

import React, {useState, useRef, useLayoutEffect, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {ArrowUp} from "lucide-react"
import {CommandPalette} from "@/features/command-palette"

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24,
    MAX_HEIGHT: 200,
};

export const ChatInput: React.FC<ChatInputProps> = ({onSendMessage, disabled}) => {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const isCommandPaletteOpen = input.startsWith("/") && !input.includes(" ");
    const commandQuery = isCommandPaletteOpen ? input.substring(1).toLowerCase() : "";

    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus();
        }
    }, [disabled]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "auto"
        const newHeight = Math.min(Math.max(textarea.scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
        textarea.scrollTop = textarea.scrollHeight;
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
                    key={commandQuery}
                    query={commandQuery}
                    onSelect={handleCommandSelect}
                />
            )}
            <div
                className="relative flex w-full items-end rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg shadow-xs p-2 md:p-2.5"
            >
                <div className="flex-1 relative" style={{
                    maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                }}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything or type / for commands..."
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none bg-transparent text-sm md:text-base text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full py-1.5 pl-2 md:pl-3 pr-2 flex items-center"
                        style={{
                            minHeight: `${CONFIG.MIN_HEIGHT}px`,
                            maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                            scrollbarGutter: 'stable',
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="bg-indigo-400 h-7 w-7 md:h-9 md:w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100 ml-1.5 md:ml-2"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
};
