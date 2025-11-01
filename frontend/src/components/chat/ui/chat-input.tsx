"use client"

import React, {useState, useRef, useLayoutEffect, useEffect} from "react"
import {Button} from "@/components/ui/button.tsx"
import {ArrowUp} from "lucide-react"
import {CommandPalette, COMMANDS, type Command} from "@/components/chat/features/command-palette.tsx"

interface ChatInputProps {
    onSendMessage: (content: string) => void
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24, // Single-row height in px
    MAX_HEIGHT: 200, // Max height with scrollbar in px
}

export function ChatInput({onSendMessage, disabled}: ChatInputProps) {
    const [input, setInput] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
    const [filteredCommands, setFilteredCommands] = useState<Command[]>(COMMANDS)
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Re-focus the input whenever it becomes enabled
    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus()
        }
    }, [disabled])

    // Resize textarea based on content
    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.style.height = "auto"
        const scrollHeight = textarea.scrollHeight
        const newHeight = Math.min(Math.max(scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
    }, [input])

    // Handle command palette logic
    useEffect(() => {
        if (input.startsWith("/") && !input.includes(" ")) {
            setIsCommandPaletteOpen(true)
            const query = input.substring(1).toLowerCase()
            const filtered = COMMANDS.filter(
                (c) =>
                    c.label.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query)
            )
            setFilteredCommands(filtered)
            setSelectedIndex(0)
        } else {
            setIsCommandPaletteOpen(false)
        }
    }, [input])

    const handleCommandSelect = (command: string) => {
        setInput(command + " ")
        setIsCommandPaletteOpen(false)
        textareaRef.current?.focus()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || disabled) return
        try {
            onSendMessage(input.trim())
            setInput("")
            textareaRef.current?.focus()
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isCommandPaletteOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
            } else if (e.key === "Enter" && filteredCommands.length > 0) {
                e.preventDefault()
                handleCommandSelect(filteredCommands[selectedIndex].value)
            } else if (e.key === "Escape") {
                setIsCommandPaletteOpen(false)
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            {isCommandPaletteOpen && filteredCommands.length > 0 && (
                <CommandPalette
                    commands={filteredCommands}
                    onSelect={handleCommandSelect}
                    selectedIndex={selectedIndex}
                />
            )}

            <div
                className="relative flex items-center rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg shadow-sm py-3 md:py-4 pl-4 md:pl-6 pr-12 md:pr-14">
        <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything or type / for commands..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent text-sm md:text-base leading-normal text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full placeholder:text-gray-400"
            style={{
                minHeight: `${CONFIG.MIN_HEIGHT}px`,
                maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                padding: 0,
                scrollbarGutter: "stable",
            }}
        />

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="absolute bg-indigo-400 right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
}