"use client"

import React, {useCallback, useLayoutEffect, useRef, useState} from "react"
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
        currentToolLog, // [CHECK] Using correct context variable
        showBanner,
        onSendMessage,
        scrollRef,
        scrollToBottom,
    } = useChatContext();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const userHasScrolledRef = useRef(false);

    // --- 1. Typing Indicator Logic ---
    const lastMessage = messages[messages.length - 1];

    // Check if assistant is currently streaming text
    const isStreamingText = lastMessage?.role === 'assistant' && lastMessage.content.length > 0;

    // Show Dots ONLY if: Loading AND No Tool Log AND Text hasn't started
    const showTypingIndicator = isLoading && !currentToolLog && !isStreamingText;

    // --- 2. Auto-Scroll Logic (Restored) ---
    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Detect if user has scrolled up manually
        const handleScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // If user is more than 150px from bottom, show button and stop auto-scroll
            const isScrolledUp = distanceFromBottom > 150;
            setShowScrollButton(isScrolledUp);
            userHasScrolledRef.current = isScrolledUp;
        };

        // Watch for content changes (new messages/tokens)
        const observer = new MutationObserver(() => {
            // Only auto-scroll if the user hasn't manually scrolled up
            if (!userHasScrolledRef.current) {
                scrollToBottom("auto");
            }
        });

        container.addEventListener("scroll", handleScroll);
        observer.observe(container, {childList: true, subtree: true, characterData: true});

        // Initial scroll check
        handleScroll();

        return () => {
            container.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, [scrollRef, scrollToBottom]);

    const handleSendMessage = useCallback(async (content: string) => {
        // Reset scroll lock when sending a new message
        userHasScrolledRef.current = false;
        await onSendMessage(content);
    }, [onSendMessage]);

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

                    {/* Transparency Layer: Shows "Searching knowledge base..." */}
                    <ToolStatus/>

                    {/* Fallback Typing Indicator */}
                    {showTypingIndicator && <TypingIndicator/>}
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="mx-auto max-w-4xl relative">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isLoading}/>
                    <TaglineRotator/>

                    {/* Scroll to Bottom Button */}
                    {showScrollButton && (
                        <Button
                            onClick={() => {
                                userHasScrolledRef.current = false;
                                scrollToBottom();
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