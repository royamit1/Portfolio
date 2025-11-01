"use client"

import React, {useCallback, useLayoutEffect, useRef, useState} from "react"
import {ChatBubble} from "@/components/chat/ui/chat-bubble.tsx"
import {ChatInput} from "@/components/chat/ui/chat-input.tsx"
import {TypingIndicator} from "@/components/chat/ui/typing-indicator.tsx"
import {TaglineRotator} from "@/components/chat/ui/tagline-rotator.tsx"
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

const SCROLL_THRESHOLD = 150;

export function ChatWindow({messages, isTyping, showBanner, banner, onSendMessage}: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const userHasScrolledRef = useRef(false)

    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        const container = scrollRef.current
        if (container) {
            container.scrollTo({top: container.scrollHeight, behavior})
        }
    }, [])

    // Unified effect for all scroll-related logic
    useLayoutEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const handleScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = container
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight

            // Show button if scrolled up beyond the threshold
            setShowScrollButton(distanceFromBottom > SCROLL_THRESHOLD)

            // If user scrolls up, set the ref. If they scroll back to the bottom, unset it.
            userHasScrolledRef.current = distanceFromBottom > SCROLL_THRESHOLD
        }

        // Auto-scroll or handle visibility on content changes
        const observer = new MutationObserver(() => {
            handleScroll() // Check button visibility on any change
            if (!userHasScrolledRef.current) {
                scrollToBottom("auto")
            }
        })

        // Also check on resize
        const resizeObserver = new ResizeObserver(() => {
            handleScroll()
        })

        container.addEventListener("scroll", handleScroll)
        observer.observe(container, {childList: true, subtree: true, characterData: true})
        resizeObserver.observe(container)

        // Initial check
        handleScroll()

        return () => {
            container.removeEventListener("scroll", handleScroll)
            observer.disconnect()
            resizeObserver.disconnect()
        }
    }, [scrollToBottom])

    // Effect to scroll down when a new message is added by the user
    useLayoutEffect(() => {
        if (!userHasScrolledRef.current) {
            scrollToBottom()
        }
    }, [messages, scrollToBottom])


    const handleSendMessage = useCallback(
        async (content: string) => {
            userHasScrolledRef.current = false // Always reset on send
            try {
                await onSendMessage(content)
            } catch (error) {
                console.error("Failed to send message:", error)
            } finally {
                scrollToBottom()
            }
        },
        [onSendMessage, scrollToBottom]
    )

    const handleScrollToBottomClick = () => {
        userHasScrolledRef.current = false
        scrollToBottom()
    }

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden">
            <div ref={scrollRef}
                 className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
                 style={{scrollbarGutter: 'stable'}}>
                <div ref={messagesEndRef} className="mx-auto max-w-4xl space-y-6">
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
                        <Button onClick={handleScrollToBottomClick} size="icon"
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
