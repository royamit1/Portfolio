"use client"

import React, {useState, useRef, useLayoutEffect, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {ArrowUp, AlertCircle} from "lucide-react"
import {CommandPalette} from "@/features/command-palette"
import {toast} from "sonner"
import {useChatContext} from "@/features/chat/context/chat-context";

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean
}

const CONFIG = {
    MIN_HEIGHT: 24,
    MAX_HEIGHT: 200,
};

export const ChatInput: React.FC<ChatInputProps> = ({onSendMessage, disabled}) => {
    const {setIsContactDialogOpen} = useChatContext();

    const [input, setInput] = useState("")
    const [hasCommandMatches, setHasCommandMatches] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const isCommandPaletteOpen = input.startsWith("/") && !input.includes(" ");
    const isInvalidCommand = isCommandPaletteOpen && !hasCommandMatches;
    const commandQuery = isCommandPaletteOpen ? input.substring(1).toLowerCase() : "";

    useEffect(() => {
        if (!disabled) {
            textareaRef.current?.focus();
        }
    }, [disabled]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.style.height = "auto"
        const newHeight = Math.min(Math.max(textarea.scrollHeight, CONFIG.MIN_HEIGHT), CONFIG.MAX_HEIGHT)
        textarea.style.height = `${newHeight}px`
        textarea.scrollTop = textarea.scrollHeight;
    }, [input])

    const showUnknownCommandToast = () => {
        toast.custom(() => (
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-md shadow-xl">
                <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-400">
                    <AlertCircle className="w-4 h-4"/>
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
        setInput("");
        if (command === "/contact") {
            setIsContactDialogOpen(true);
            return;
        }

        let prompt: string;
        switch (command) {
            case "/projects":
                prompt = "Tell me about your featured projects";
                break;
            case "/skills":
                prompt = "What are your technical skills?";
                break;
            case "/resume":
                prompt = "Tell me about your resume";
                break;
            default:
                // Fallback for unknown commands, just send the description or the command itself
                prompt = command;
                break;
        }

        if (prompt) {
            onSendMessage(prompt);
        }

        textareaRef.current?.focus();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isInvalidCommand) {
            showUnknownCommandToast();
            return;
        }

        if (!input.trim() || disabled) return

        onSendMessage(input.trim())
        setInput("")
        textareaRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isCommandPaletteOpen) {
            if (e.key === "Escape") {
                setInput("");
                return;
            }

            if (e.key === "Enter") {
                e.preventDefault();

                if (!hasCommandMatches) {
                    showUnknownCommandToast();
                }
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
                className="relative flex w-full items-end rounded-3xl md:rounded-4xl border border-input bg-chat-input-bg shadow-xs p-2 md:p-2.5"
            >
                <div className="flex-1 relative" style={{
                    maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
                }}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything or type / for commands..."
                        disabled={disabled}
                        rows={1}
                        className="w-full resize-none bg-transparent text-sm md:text-base text-gray-200 focus-visible:outline-none scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 scrollbar-thumb-rounded-full py-1.5 pl-2 md:pl-3 pr-2 flex items-center"
                        style={{
                            minHeight: `${CONFIG.MIN_HEIGHT}px`,
                            maxHeight: `${CONFIG.MAX_HEIGHT}px`,
                            scrollbarGutter: 'stable',
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="bg-indigo-400 h-7 w-7 md:h-9 md:w-9 shrink-0 rounded-full transition-all duration-200 hover:scale-110 disabled:scale-100 ml-1.5 md:ml-2"
                >
                    <ArrowUp className="h-4 w-4"/>
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </form>
    )
};
