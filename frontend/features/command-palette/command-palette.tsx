"use client"

import {useState, useEffect, useMemo} from "react";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {COMMANDS} from "./commands";

interface CommandPaletteProps {
    query: string;
    onSelect: (command: string) => void;
}

export function CommandPalette({query, onSelect}: CommandPaletteProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredCommands = useMemo(() => {
        return COMMANDS.filter(
            (c) =>
                c.label.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query)
        );
    }, [query]);

    // Effect to handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === "Enter" && filteredCommands.length > 0) {
                e.preventDefault();
                onSelect(filteredCommands[selectedIndex].value);
            }
        };

        // Add event listener to the document
        document.addEventListener("keydown", handleKeyDown);
        // Cleanup function to remove the event listener
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [filteredCommands, selectedIndex, onSelect]);

    if (filteredCommands.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // THEME UPDATE: bg-zinc-900, border-white/10
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden z-50 ring-1 ring-black/50"
        >
            <div className="p-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 px-2 py-1">
                    COMMANDS
                </p>
                <ul className="mt-1 space-y-1">
                    {filteredCommands.map((command, index) => (
                        <li
                            key={command.value}
                            onClick={() => onSelect(command.value)}
                            className={cn(
                                "group relative flex cursor-pointer select-none items-center rounded-lg transition-all duration-300 overflow-hidden",
                                selectedIndex === index && "selected"
                            )}
                        >
                            {/* Hover/Selected Background - THEME UPDATE: Indigo-500/10 */}
                            <div
                                className={cn(
                                    "absolute inset-0 transition-all duration-300",
                                    selectedIndex === index
                                        ? "bg-indigo-500/10"
                                        : "bg-transparent group-hover:bg-zinc-800"
                                )}
                            />

                            <div
                                className={cn(
                                    "relative z-10 flex items-center gap-3 p-2.5 w-full transition-transform duration-300",
                                    selectedIndex === index
                                        ? "translate-x-1"
                                        : "group-hover:translate-x-1"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-2 rounded-md transition-all duration-300",
                                        selectedIndex === index
                                            ? "bg-indigo-500/20 text-indigo-400"
                                            : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-300"
                                    )}
                                >
                                    <command.icon className="h-4 w-4" />
                                </div>

                                <div className="flex flex-col">
                                    <span
                                        className={cn(
                                            "text-sm font-medium transition-colors duration-300",
                                            selectedIndex === index
                                                ? "text-indigo-200"
                                                : "text-zinc-300 group-hover:text-zinc-200"
                                        )}
                                    >
                                        {command.label}
                                    </span>
                                    <span className="text-xs text-zinc-500">
                                        {command.description}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}
