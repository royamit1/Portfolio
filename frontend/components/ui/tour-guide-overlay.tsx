"use client";

import { useEffect, useState } from "react";
import { useChatContext } from "@/features/chat/context/chat-context";
import { AnimatePresence, motion } from "framer-motion";

export function TourGuideOverlay() {
    const { tourStep } = useChatContext();
    const [style, setStyle] = useState<{ top: number; left: number; transform: string } | null>(null);

    useEffect(() => {
        if (!tourStep) return;

        const updatePosition = () => {
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Center placement
            if (tourStep.placement === "center") {
                setStyle({
                    top: (viewportHeight / 2) - 50,
                    left: viewportWidth / 2,
                    transform: "translate(-50%, -50%)"
                });
                return;
            }

            // Get anchor element
            const anchorId = tourStep.popupAnchorId || tourStep.targetId;
            const element = document.getElementById(anchorId);

            if (!element) {
                return;
            }

            const rect = element.getBoundingClientRect();

            const sidebarElement = document.getElementById('sidebar-wrapper');
            const sidebarRight = sidebarElement ? sidebarElement.getBoundingClientRect().right : rect.right;

            const gap = 16;
            let top = 0;
            let left = 0;
            let transform = "";

            switch (tourStep.placement) {
                case "right":
                    left = sidebarRight + gap;

                    if (tourStep.targetId === 'sidebar-wrapper') {
                        top = (viewportHeight / 2) - 50;
                        transform = "translate(0, -50%)";
                    } else {
                        const isBottomHalf = rect.top > viewportHeight / 2;
                        if (isBottomHalf) {
                            const targetCenter = rect.top + rect.height / 2;
                            const desiredBottom = targetCenter + 25;
                            top = Math.min(desiredBottom, viewportHeight - 20);
                            transform = "translate(0, -100%)";
                        } else {
                            top = rect.top + rect.height / 2;
                            transform = "translate(0, -50%)";
                        }
                    }
                    break;

                case "left":
                    top = rect.top + rect.height / 2;
                    left = rect.left - gap;
                    transform = "translate(-100%, -50%)";
                    break;

                case "top":
                    top = rect.top - gap;
                    left = rect.left + rect.width / 2;
                    transform = "translate(-50%, -100%)";
                    break;

                case "bottom":
                    top = rect.bottom + gap;
                    left = rect.left + rect.width / 2;
                    transform = "translate(-50%, 0)";
                    break;
            }

            setStyle({ top, left, transform });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [tourStep]);

    return (
        <>
            <AnimatePresence>
                {tourStep && (
                    <motion.div
                        key="tour-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {tourStep && style && (
                    <motion.div
                        key={tourStep.message}
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed z-[60] max-w-[280px] md:max-w-xs pointer-events-none"
                        style={{
                            top: style.top,
                            left: style.left,
                            transform: style.transform
                        }}
                    >
                        <div
                            className="relative bg-zinc-950 border border-zinc-700 text-zinc-100 p-4 rounded-xl shadow-2xl">
                            {tourStep.placement === "right" && (
                                <div
                                    className="absolute left-[-6px] w-3 h-3 bg-zinc-950 border-l border-b border-zinc-700 transform rotate-45"
                                    style={{
                                        top: style.transform.includes("-100%") ? "calc(100% - 25px)" : "50%",
                                        marginTop: style.transform.includes("-100%") ? "0" : "-6px"
                                    }}
                                />
                            )}
                            {tourStep.placement === "top" && (
                                <div
                                    className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-950 border-r border-b border-zinc-700 transform rotate-45"
                                />
                            )}

                            <div className="relative flex items-start gap-3 z-10">
                                {tourStep.placement === "center" && (
                                    <span className="text-2xl shrink-0">✨</span>
                                )}
                                <p className="text-sm font-medium leading-relaxed text-zinc-200">
                                    {tourStep.message}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}