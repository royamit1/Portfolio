"use client";

import {Button} from "@/components/ui/button"
import {Trash2, Loader2} from "lucide-react"
import {useChatContext} from "@/features/chat/context/chat-context"
import {cn} from "@/lib/utils"

export function ClearChatButton() {
    const {onClearChat, isLoading} = useChatContext();

    return (
        <div className="relative z-10 p-4 md:p-5">
            <Button
                onClick={onClearChat}
                disabled={isLoading}
                variant="outline"
                className={cn(
                    "group relative w-full justify-start gap-3 md:gap-4 rounded-xl py-4 md:py-5 overflow-hidden transition-all duration-300",
                    "bg-zinc-900/50 border border-white/10 backdrop-blur-sm",
                    "hover:bg-zinc-800 hover:shadow-lg hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {/* Hover Gradient Effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {isLoading ? (
                    <Loader2 className="h-4 w-4 relative z-10 animate-spin text-muted-foreground"/>
                ) : (
                    <Trash2
                        className="h-4 w-4 relative z-10 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-red-400 group-hover:rotate-12"
                    />
                )}

                <span
                    className="relative z-10 font-medium text-sm md:text-base text-zinc-300 group-hover:text-white transition-colors">
                    {isLoading ? "Agent Working..." : "Clear Chat"}
                </span>
            </Button>
        </div>
    )
}