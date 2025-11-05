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
            initial={{opacity: 0, y: 10, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 10, scale: 0.95}}
            transition={{duration: 0.2, ease: "easeOut"}}
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
        >
            <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                    COMMANDS
                </p>
                <ul className="mt-1 space-y-1">
                    {filteredCommands.map((command, index) => (
                        <li
                            key={command.value}
                            onClick={() => onSelect(command.value)}
                            className={cn(
                                "group relative flex cursor-pointer select-none items-center rounded-xl transition-all duration-300 overflow-hidden",
                                selectedIndex === index && "selected"
                            )}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-topic-button-accent/0 via-topic-button-accent/0 to-topic-button-accent/0 opacity-0 group-hover:opacity-100 group-[&.selected]:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] group-[&.selected]:translate-x-[100%] transform"
                                style={{transition: "transform 0.8s ease-out, opacity 0.3s ease-out"}}
                            />

                            <div
                                className={cn(
                                    "absolute inset-0 bg-topic-button-accent/10 rounded-xl opacity-0 blur-sm transition-opacity duration-300",
                                    selectedIndex === index
                                        ? "opacity-100"
                                        : "group-hover:opacity-100"
                                )}
                            />

                            <div
                                className={cn(
                                    "absolute inset-0 rounded-xl transition-all duration-300",
                                    selectedIndex === index
                                        ? "bg-topic-button-accent"
                                        : "bg-transparent group-hover:bg-topic-button-accent"
                                )}
                            />

                            <div
                                className={cn(
                                    "relative z-10 flex items-center gap-3 p-2 w-full transition-transform duration-300",
                                    selectedIndex === index
                                        ? "scale-[1.02] translate-x-2"
                                        : "group-hover:scale-[1.02] group-hover:translate-x-2"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-2 rounded-lg bg-topic-button-accent/10 transition-all duration-300",
                                        selectedIndex === index
                                            ? "bg-topic-button-accent/20 scale-110 rotate-6"
                                            : "group-hover:bg-topic-button-accent/20 group-hover:scale-110 group-hover:rotate-6"
                                    )}
                                >
                                    <command.icon
                                        className={cn(
                                            "h-5 w-5 transition-all duration-300",
                                            selectedIndex === index
                                                ? "text-indigo-400"
                                                : "text-indigo-600 dark:text-indigo-400"
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col">
                  <span
                      className={cn(
                          "text-sm font-medium transition-colors duration-300",
                          selectedIndex === index
                              ? "text-topic-button-accent-foreground"
                              : "text-foreground group-hover:text-topic-button-accent-foreground"
                      )}
                  >
                    {command.label}
                  </span>
                                    <span
                                        className={cn(
                                            "text-xs transition-colors duration-300",
                                            selectedIndex === index
                                                ? "text-topic-button-accent-foreground/70"
                                                : "text-muted-foreground group-hover:text-topic-button-accent-foreground/70"
                                        )}
                                    >
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
