"use client"

import React, {useCallback, useLayoutEffect, useRef, useState, useEffect} from "react"
import {ChatBubble} from "./chat-bubble"
import {ChatInput} from "./chat-input"
import {ToolStatus} from "./tool-status"
import {TypingIndicator} from "./typing-indicator"
import {TaglineRotator} from "./tagline-rotator"
import {Button} from "@/components/ui/button"
import {ChevronDown} from "lucide-react"
import {useChatContext} from "../context/chat-context"

interface ChatWindowProps {
    banner: React.ReactNode
}

export function ChatWindow({banner}: ChatWindowProps) {
    const {
        messages,
        isLoading,
        currentToolLog,
        showBanner,
        onSendMessage,
        scrollRef,
        scrollToBottom,
    } = useChatContext();

    const [showScrollButton, setShowScrollButton] = useState(false);

    // Tracks if the user intentionally scrolled up
    const isUserScrolledUpRef = useRef(false);

    // [FIX 1] Track if the scroll was caused by our code
    const isProgrammaticScrollRef = useRef(false);

    // --- Typing Indicator Logic ---
    const lastMessage = messages[messages.length - 1];
    const isStreamingText = lastMessage?.role === 'assistant' && lastMessage.content.length > 0;
    const showTypingIndicator = isLoading && !currentToolLog && !isStreamingText;

    // --- Smart Scroll Listener ---
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            // [FIX 2] If WE caused the scroll, ignore this event and reset the flag
            if (isProgrammaticScrollRef.current) {
                isProgrammaticScrollRef.current = false;
                return;
            }

            const {scrollTop, scrollHeight, clientHeight} = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // Threshold: 20px (forgiving enough for zoom levels/sub-pixel math)
            const isScrolledUp = distanceFromBottom > 20;

            isUserScrolledUpRef.current = isScrolledUp;
            setShowScrollButton(isScrolledUp);
        };

        container.addEventListener("scroll", handleScroll, {passive: true});
        // Initial check
        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollRef]);

    // --- Auto-Scroll Effect ---
    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // If user hasn't manually scrolled up, snap to bottom
        if (!isUserScrolledUpRef.current) {
            // [FIX 3] Set flag BEFORE scrolling
            isProgrammaticScrollRef.current = true;
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, currentToolLog, showTypingIndicator]);

    const handleSendMessage = useCallback(async (content: string) => {
        // Reset user scroll state when sending new message
        isUserScrolledUpRef.current = false;

        // Force scroll immediately
        if (scrollRef.current) {
            isProgrammaticScrollRef.current = true;
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        await onSendMessage(content);
    }, [onSendMessage, scrollRef]);

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden">
            <div ref={scrollRef}
                 className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full"
                 style={{scrollbarGutter: 'stable'}}>

                <div className="mx-auto max-w-4xl space-y-6">
                    {showBanner && <div className="flex justify-center">{banner}</div>}

                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg}/>
                    ))}

                    <ToolStatus/>

                    {showTypingIndicator && <TypingIndicator/>}
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="mx-auto max-w-4xl relative">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isLoading}/>
                    <TaglineRotator/>

                    {showScrollButton && (
                        <Button
                            onClick={() => {
                                isUserScrolledUpRef.current = false;
                                isProgrammaticScrollRef.current = true; // [FIX 4] Flag manual button click too
                                scrollToBottom("smooth");
                            }}
                            size="icon"
                            className="absolute -top-14 left-1/2 transform -translate-x-1/2 h-10 w-10 rounded-full shadow-lg"
                            variant="secondary"
                        >
                            <ChevronDown className="h-5 w-5"/>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
