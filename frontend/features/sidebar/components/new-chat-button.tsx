"use client";

import { Button } from "@/components/ui/button"
import { Edit, Loader2 } from "lucide-react"
import { useChatContext } from "@/features/chat/context/chat-context"
import { cn } from "@/lib/utils"

export function NewChatButton() {
    const { onClearChat, isLoading, tourStep } = useChatContext();

    return (
        <div
            id="tour-clear-chat"
            className={cn(
                "px-6 xl:px-5 pt-2 xl:pt-4 transition-all duration-300",
                tourStep?.targetId === "tour-clear-chat" && "spotlight-active z-50"
            )}
        >
            <Button
                onClick={onClearChat}
                disabled={isLoading}
                variant="outline"
                className={cn(
                    "group relative w-full justify-start gap-4 xl:gap-5 rounded-xl py-5 xl:py-5 overflow-hidden transition-all duration-300",
                    "bg-zinc-900/50 border border-white/10",
                    "hover:bg-zinc-800/50 hover:border-indigo-500/30",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    tourStep?.targetId === "tour-clear-chat" && "border-indigo-500/50 bg-zinc-800/50"
                )}
            >
                {/* Subtle hover gradient */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {isLoading ? (
                    <Loader2 className="h-5 w-5 md:h-6 md:w-6 relative z-10 animate-spin text-zinc-400" />
                ) : (
                    <Edit
                        className={cn(
                            "h-5 w-5 md:h-6 md:w-6 relative z-10 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400",
                            tourStep?.targetId === "tour-clear-chat" && "text-indigo-400"
                        )}
                    />
                )}

                <span className={cn(
                    "relative z-10 font-medium text-base md:text-lg text-zinc-300 group-hover:text-white transition-colors",
                    tourStep?.targetId === "tour-clear-chat" && "text-white"
                )}>
                    {isLoading ? "Working..." : "New Chat"}
                </span>
            </Button>
        </div>
    )
}
