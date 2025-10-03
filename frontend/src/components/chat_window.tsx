"use client"

import type React from "react"

import {useEffect, useRef, useState} from "react"
import {ChatBubble} from "@/components/chat_bubble"
import {ChatInput} from "@/components/chat_input"
import {TypingIndicator} from "@/components/typing_indicator"
import {TaglineRotator} from "@/components/tagline_rotator"
import {Button} from "@/components/ui/button"
import {ChevronDown} from "lucide-react"
import type {Message} from "@/lib/types"

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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleScroll = () => {
        if (scrollRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = scrollRef.current
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
            setShowScrollButton(!isNearBottom)
        }
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    }

    return (
        <div className="relative flex flex-col h-full">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
            >
                <div className="mx-auto max-w-4xl space-y-6">
                    {showBanner && <div className="flex justify-center py-12">{banner}</div>}
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

                    {isTyping && (
                        <>
                            <TypingIndicator/>
                        </>
                    )}
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="mx-auto max-w-4xl relative">
                    <ChatInput onSendMessage={onSendMessage} disabled={isTyping}/>
                    <TaglineRotator/>

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
