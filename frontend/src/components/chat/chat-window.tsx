"use client"

import React, {useCallback, useLayoutEffect, useRef, useState} from "react"
import {ChatBubble} from "@/components/chat/chat-bubble.tsx"
import {ChatInput} from "@/components/chat/chat-input.tsx"
import {TypingIndicator} from "@/components/chat/typing-indicator.tsx"
import {TaglineRotator} from "@/components/chat/tagline-rotator.tsx"
import {Button} from "@/components/ui/button.tsx"
import {ChevronDown} from "lucide-react"
import type {Message} from "@/lib/types.ts"

interface ChatWindowProps {
    messages: Message[]
    isTyping: boolean
    showBanner: boolean
    banner: React.ReactNode
    onSendMessage: (content: string) => Promise<void> | void
}

// Scroll behavior thresholds (pixels)
const SCROLL_BUTTON_THRESHOLD = 100
const USER_SCROLL_THRESHOLD = 150

export function ChatWindow({messages, isTyping, showBanner, banner, onSendMessage}: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const userHasScrolledRef = useRef(false)
    const lastMessageCountRef = useRef(messages.length)
    const [showScrollButton, setShowScrollButton] = useState(false)

    // Auto-scroll when new messages arrive or typing indicator appears
    useLayoutEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const messageCountChanged = messages.length !== lastMessageCountRef.current
        lastMessageCountRef.current = messages.length

        if (!userHasScrolledRef.current || messageCountChanged || isTyping) {
            container.scrollTo({top: container.scrollHeight, behavior: "smooth"})
        }
    }, [messages, isTyping])

    // Track manual scroll and toggle scroll button
    const handleScroll = useCallback(() => {
        requestAnimationFrame(() => {
            const container = scrollRef.current
            if (!container) return

            const {scrollTop, scrollHeight, clientHeight} = container
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight

            setShowScrollButton(distanceFromBottom > SCROLL_BUTTON_THRESHOLD)
            userHasScrolledRef.current = distanceFromBottom > USER_SCROLL_THRESHOLD
        })
    }, [])

    // Scroll to bottom programmatically
    const scrollToBottom = useCallback(() => {
        const container = scrollRef.current
        if (!container) return

        container.scrollTo({top: container.scrollHeight, behavior: "smooth"})
        userHasScrolledRef.current = false
    }, [])

    // Send message and scroll to bottom
    const handleSendMessage = useCallback(
        async (content: string) => {
            try {
                await onSendMessage(content)
            } catch (error) {
                console.error("Failed to send message:", error)
            } finally {
                // After sending, scroll to bottom
                scrollToBottom()
            }
        },
        [onSendMessage, scrollToBottom]
    )

    return (
        <div className="relative flex flex-col h-full">
            <div ref={scrollRef} onScroll={handleScroll}
                 className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full">
                <div className="mx-auto max-w-4xl space-y-6">
                    {showBanner && <div className="flex justify-center">{banner}</div>}
                    {messages.map((msg, index) => (
                        <ChatBubble key={msg.id} message={msg}
                                    style={{animation: `slideUp 0.4s ease-out ${index * 0.1}s both`}}/>
                    ))}
                    {isTyping && <TypingIndicator/>}
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="mx-auto max-w-4xl relative">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isTyping}/>
                    <TaglineRotator/>
                    {showScrollButton && (
                        <Button onClick={scrollToBottom} size="icon"
                                className="absolute -top-14 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full shadow-lg transition-all duration-300 animate-in fade-in cursor-pointer hover:scale-110"
                                variant="secondary">
                            <ChevronDown className="h-5 w-5"/>
                            <span className="sr-only">Scroll to bottom</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}