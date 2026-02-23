"use client"

import { useLayoutEffect, useState, useEffect } from "react"
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
        isComponentStreaming,
        currentToolLog,
        isRestoringMessages,
        hasMessagesToRestore,
        showBanner,
        scrollRef,
        scrollToBottom,
    } = useChatContext();

    const [showScrollButton, setShowScrollButton] = useState(false);

    // Show typing indicator only when loading without tool activity or streaming
    const lastMessage = messages[messages.length - 1];
    const isStreamingText = lastMessage?.role === 'assistant' && lastMessage.content.length > 0;
    const showTypingIndicator = isLoading && !currentToolLog && !isStreamingText;

    // Scroll button visibility — tracks whether user has scrolled up
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            setShowScrollButton(distanceFromBottom > 50);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollRef]);

    // Auto-scroll to bottom — measures position directly to avoid race conditions
    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Reset when chat is cleared
        if (messages.length === 0) {
            setShowScrollButton(false);
            return;
        }

        const lastMsg = messages[messages.length - 1];
        const secondLastMsg = messages[messages.length - 2];

        // Detect a freshly sent message: either the last message is from the user,
        // or the user message + empty AI placeholder were added together by useChat
        const isNewUserMessage =
            lastMsg?.role === 'user' ||
            (lastMsg?.role === 'assistant' && lastMsg.content === '' && secondLastMsg?.role === 'user');

        if (isNewUserMessage) {
            // User just sent a message — always scroll to bottom
            setShowScrollButton(false);
            scrollToBottom('smooth', true);
            return;
        }

        // During streaming: only auto-scroll if user is near the bottom.
        // Measure directly — no refs, no guards, no race conditions.
        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        if (distanceFromBottom < 50) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, currentToolLog, showTypingIndicator, scrollToBottom]);

    return (
        <>
            <AnimatePresence>
                {isRestoringMessages && <LoadingSplash showText={hasMessagesToRestore} />}
            </AnimatePresence>

            <div className="relative flex flex-1 flex-col overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-8 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
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
                        <ChatInput disabled={isLoading || isComponentStreaming} />

                        <TaglineRotator />

                        {showScrollButton && (
                            <Button
                                onClick={() => {
                                    scrollToBottom("smooth", true);
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
