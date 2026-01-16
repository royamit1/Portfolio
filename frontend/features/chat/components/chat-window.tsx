"use client"

import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react"
import { ChatBubble } from "./chat-bubble"
import { ChatInput } from "./chat-input"
import { ToolStatus } from "./tool-status"
import { TypingIndicator } from "./typing-indicator"
import { TaglineRotator } from "./tagline-rotator"
import { LoadingSplash } from "./loading-splash"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useChatContext } from "@/features/chat/context/chat-context"
import { AnimatePresence } from "framer-motion"

interface ChatWindowProps {
    banner: React.ReactNode
}

export function ChatWindow({ banner }: ChatWindowProps) {
    const {
        messages,
        isLoading,
        currentToolLog,
        isRestoringMessages,
        hasMessagesToRestore,
        showBanner,
        onSendMessage,
        scrollRef,
        scrollToBottom,
    } = useChatContext();

    const [showScrollButton, setShowScrollButton] = useState(false);

    // Tracks if the user has intentionally scrolled up to read history
    const isUserScrolledUpRef = useRef(false);

    // Flags when a scroll is triggered by code to prevent conflicts with the scroll listener
    const isProgrammaticScrollRef = useRef(false);

    // Determine if we should show the typing indicator
    // We hide it if text is currently streaming to avoid visual clutter
    const lastMessage = messages[messages.length - 1];
    const isStreamingText = lastMessage?.role === 'assistant' && lastMessage.content.length > 0;
    const showTypingIndicator = isLoading && !currentToolLog && !isStreamingText;

    // Smart Scroll Listener
    // Detects if the user scrolls up and toggles the "Scroll to Bottom" button
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Ignore scroll events triggered by our auto-scroll logic
            if (isProgrammaticScrollRef.current) {
                isProgrammaticScrollRef.current = false;
                return;
            }

            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // Threshold of 20px allows for sub-pixel rendering differences
            const isScrolledUp = distanceFromBottom > 20;

            isUserScrolledUpRef.current = isScrolledUp;
            setShowScrollButton(isScrolledUp);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });

        // Initial check to set button state on mount
        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollRef]);

    // Auto-Scroll Effect
    // Snaps to bottom when new messages arrive, unless the user is reading history
    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        if (!isUserScrolledUpRef.current) {
            isProgrammaticScrollRef.current = true;
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, currentToolLog, showTypingIndicator]);

    const handleSendMessage = useCallback(async (content: string) => {
        // Reset scroll state to force snap-to-bottom when sending
        isUserScrolledUpRef.current = false;

        if (scrollRef.current) {
            isProgrammaticScrollRef.current = true;
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        await onSendMessage(content);
    }, [onSendMessage, scrollRef]);

    return (
        <>
            <AnimatePresence>
                {isRestoringMessages && <LoadingSplash showText={hasMessagesToRestore} />}
            </AnimatePresence>

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
                    style={{ scrollbarGutter: 'stable' }}
                >
                    <div className="mx-auto max-w-4xl space-y-6">
                        {showBanner && <div className="flex justify-center">{banner}</div>}

                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}

                        <ToolStatus />

                        {showTypingIndicator && <TypingIndicator />}
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <div className="mx-auto max-w-4xl relative">
                        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

                        {/* Hide tagline during tour to reduce noise */}
                        <TaglineRotator />

                        {showScrollButton && (
                            <Button
                                onClick={() => {
                                    isUserScrolledUpRef.current = false;
                                    isProgrammaticScrollRef.current = true;
                                    scrollToBottom("smooth");
                                }}
                                size="icon"
                                className="absolute -top-14 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full shadow-lg"
                                variant="secondary"
                            >
                                <ChevronDown className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}