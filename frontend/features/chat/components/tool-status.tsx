"use client";

import {motion, AnimatePresence} from "framer-motion";
import {useChatContext} from "@/features/chat/context/chat-context";
import {Loader2, CheckCircle2, AlertCircle} from "lucide-react";

// Configuration map for status states to keep JSX clean
const STATUS_CONFIG = {
    loading: {icon: Loader2, color: "text-blue-500", className: "animate-spin"},
    success: {icon: CheckCircle2, color: "text-emerald-500", className: ""},
    error: {icon: AlertCircle, color: "text-red-500", className: ""},
};

export function ToolStatus() {
    const {currentToolLog} = useChatContext();

    if (!currentToolLog) return null;

    // Default to loading if status is undefined, though strictly typed this shouldn't happen
    const config = STATUS_CONFIG[currentToolLog.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.loading;
    const Icon = config.icon;

    return (
        <AnimatePresence mode="wait">
            <div className="flex w-full justify-start mb-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="max-w-[90%] md:max-w-[85%] px-4 md:px-5">
                    <motion.div
                        key={currentToolLog.message}
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.95}}
                        transition={{duration: 0.2}}
                        className="
                            inline-flex items-center gap-2.5 px-3 py-1.5
                            rounded-full border border-gray-200/50 dark:border-white/10
                            bg-white/80 dark:bg-zinc-900/80
                            backdrop-blur-md shadow-sm select-none
                        "
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <Icon className={`h-4 w-4 ${config.color} ${config.className}`}/>
                        </div>

                        <span
                            className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground/90 font-mono pt-[1px]">
                            {currentToolLog.message}
                        </span>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}