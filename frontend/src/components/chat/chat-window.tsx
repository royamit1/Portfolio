"use client"

import {useEffect, useRef, useState} from "react"
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
    onSendMessage: (content: string) => void
}

export function ChatWindow({messages, isTyping, showBanner, banner, onSendMessage}: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [userHasScrolled, setUserHasScrolled] = useState(false)
    const lastMessageCountRef = useRef(messages.length)

    // ✅ Auto-scroll when new messages arrive or typing indicator appears
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        // Check if a new message was added or typing indicator changed
        const messageCountChanged = messages.length !== lastMessageCountRef.current
        lastMessageCountRef.current = messages.length

        // Only auto-scroll if user hasn't manually scrolled up, OR if it's a new message
        if (!userHasScrolled || messageCountChanged || isTyping) {
            // Use setTimeout to ensure DOM has fully updated
            setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                })
                setUserHasScrolled(false)
            }, 50)
        }
    }, [messages, isTyping, userHasScrolled])

    // ✅ Track if user manually scrolled
    const handleScroll = () => {
        const container = scrollRef.current
        if (!container) return

        const {scrollTop, scrollHeight, clientHeight} = container
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight

        // User is near bottom
        const isNearBottom = distanceFromBottom < 100

        // Show scroll button when user is not near bottom
        setShowScrollButton(!isNearBottom)

        // Mark as manually scrolled if user scrolls up significantly
        if (distanceFromBottom > 150) {
            setUserHasScrolled(true)
        } else {
            setUserHasScrolled(false)
        }
    }

    const scrollToBottom = () => {
        const container = scrollRef.current
        if (!container) return

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        })
        setUserHasScrolled(false)
    }

    return (
        <div className="relative flex flex-col h-full">
            {/* ✅ Scrollable container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
            >
                <div className="mx-auto max-w-4xl space-y-6">
                    {showBanner && <div className="flex justify-center">{banner}</div>}

                    {messages.map((message, index) => (
                        <div key={message.id}>
                            <ChatBubble
                                message={message}
                                style={{
                                    animation: `slideUp 0.4s ease-out ${index * 0.1}s both`,
                                }}
                            />
                        </div>
                    ))}

                    {isTyping && <TypingIndicator/>}
                </div>
            </div>

            {/* ✅ Input area (not scrollable) */}
            <div className="px-4 pb-4">
                <div className="mx-auto max-w-4xl relative">
                    <ChatInput onSendMessage={onSendMessage} disabled={isTyping}/>
                    <TaglineRotator/>

                    {/* ✅ Scroll to bottom button */}
                    {showScrollButton && (
                        <Button
                            onClick={scrollToBottom}
                            size="icon"
                            className="absolute -top-14 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full shadow-lg transition-all duration-300 animate-in fade-in cursor-pointer hover:scale-110"
                            variant="secondary"
                        >
                            <ChevronDown className="h-5 w-5"/>
                            <span className="sr-only">Scroll to bottom</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}