"use client";

import {motion, AnimatePresence} from "framer-motion";
import {useChatContext} from "../context/chat-context";
import {Loader2, CheckCircle2, AlertCircle} from "lucide-react";

export function ToolStatus() {
    const {currentToolLog} = useChatContext();
    const statusLog = currentToolLog;

    if (!statusLog) return null;

    return (
        <AnimatePresence mode="wait">
            <div className="flex w-full justify-start mb-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="max-w-[90%] md:max-w-[85%] px-4 md:px-5">
                    <motion.div
                        key={statusLog.message}
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
                        {/* Animated Icons - Slightly Larger */}
                        <div className="relative flex items-center justify-center w-5 h-5">
                            {statusLog.status === "loading" && (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500"/>
                            )}
                            {statusLog.status === "success" && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500"/>
                            )}
                            {statusLog.status === "error" && (
                                <AlertCircle className="h-4 w-4 text-red-500"/>
                            )}
                        </div>

                        {/* Status Text - More Readable Size */}
                        <span
                            className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground/90 font-mono pt-[1px]">
                            {statusLog.message}
                        </span>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}