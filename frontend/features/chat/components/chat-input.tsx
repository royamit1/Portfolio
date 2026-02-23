"use client"

import React, { useState, useRef, useLayoutEffect, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, AlertCircle } from "lucide-react"
import { CommandPalette } from "@/features/command-palette"
import { toast } from "sonner"
import { useChatContext } from "@/features/chat/context/chat-context";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24,
    MAX_HEIGHT: 200,
};

export const ChatInput: React.FC<ChatInputProps> = ({ disabled }) => {
    const {
        inputText,
        setInputText,
        setIsContactDialogOpen,
        onTopicSelect,
        onSendMessage,
        tourStep,
    } = useChatContext();

    const [hasCommandMatches, setHasCommandMatches] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const isCommandPaletteOpen = inputText.startsWith("/") && !inputText.includes(" ");
    const isInvalidCommand = isCommandPaletteOpen && !hasCommandMatches;
    const commandQuery = isCommandPaletteOpen ? inputText.substring(1).toLowerCase() : "";

    useEffect(() => {
        if (!disabled) {
            // Don't auto-focus on touch devices to avoid reopening the keyboard
            // after the agent finishes responding — let the user read the answer first
            const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
            if (!isTouchDevice) {
                textareaRef.current?.focus();
            }
        }
    }, [disabled]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.style.height = "auto"
        const newHeight = Math.min(Math.max(textarea.scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
        textarea.scrollTop = textarea.scrollHeight;
    }, [inputText])

    const showUnknownCommandToast = () => {
        toast.custom(() => (
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-md shadow-xl">
                <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-400">
                    <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-zinc-200">Unknown Command</span>
                    <span className="text-xs text-zinc-500">
                        Try <span className="text-indigo-400">/projects</span>, <span
                            className="text-indigo-400">/skills</span>, or <span className="text-indigo-400">/resume</span>
                    </span>
                </div>
            </div>
        ));
    };

    const handleCommandSelect = (command: string) => {
        setInputText("");
        if (command === "/contact") {
            setIsContactDialogOpen(true);
            return;
        }

        const topicId = command.replace("/", "");
        const visualTopics = ["projects", "skills", "resume"];

        if (visualTopics.includes(topicId)) {
            onTopicSelect(topicId);
        } else {
            onTopicSelect(command);
        }

        textareaRef.current?.focus();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isInvalidCommand) {
            showUnknownCommandToast();
            return;
        }

        if (!inputText.trim() || disabled) return

        onSendMessage(inputText.trim())
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isCommandPaletteOpen) {
            if (e.key === "Escape") {
                setInputText("");
                return;
            }
            if (e.key === "Enter") {
                e.preventDefault();
                if (!hasCommandMatches) showUnknownCommandToast();
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
                    onHasMatches={setHasCommandMatches}
                />
            )}

            <div
                id="chat-input-area"

                className={cn(
                    "relative flex w-full items-center rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg p-2 md:p-2.5",
                    "transition-all duration-300",
                    tourStep?.targetId === "chat-input-area" && "spotlight-active z-50 bg-background"
                )}
            >

                {/* Fade effect at scroll edges */}
                <div
                    className="flex-1 relative"
                    style={{
                        maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything or type / for commands..."
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none bg-transparent text-sm md:text-base text-gray-200 placeholder-gray-300 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full py-1.5 pl-2 md:pl-3 pr-2 flex items-center"
                        style={{
                            minHeight: `${CONFIG.MIN_HEIGHT}px`,
                            maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                            scrollbarGutter: 'stable',
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={disabled || !inputText.trim()}
                    size="icon"
                    className="bg-indigo-400 h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100 ml-1.5 md:ml-2"
                >
                    <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
};
