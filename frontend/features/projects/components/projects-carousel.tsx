"use client"

import React, { useState, useEffect, useRef, useCallback, type TouchEvent } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

// --- Types ---

export interface ProjectItem {
    id: number
    title: string
    category: string
    description: string
    techStack: string[]
    link?: string
    github?: string
    image?: string
}

interface ProjectsCarouselProps {
    items: ProjectItem[]
    autoRotate?: boolean
}

// --- Constants ---

const AUTO_ROTATE_INTERVAL = 6000
const MIN_SWIPE_DISTANCE = 50
const PAUSE_AFTER_INTERACTION = 5000 // Resume auto-rotate after 5 seconds of no interaction

export function ProjectsCarousel({ items, autoRotate = false }: ProjectsCarouselProps) {
    const [active, setActive] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const carouselRef = useRef<HTMLDivElement>(null)
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Pause auto-rotation on user interaction, resume after delay
    const pauseAutoRotation = useCallback(() => {
        setIsPaused(true)
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current)
        }
        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false)
        }, PAUSE_AFTER_INTERACTION)
    }, [])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current)
            }
        }
    }, [])

    // --- Navigation Logic ---

    const handleNext = useCallback(() => {
        pauseAutoRotation()
        setActive((prev) => (prev + 1) % items.length)
    }, [items.length, pauseAutoRotation])

    const handlePrev = useCallback(() => {
        pauseAutoRotation()
        setActive((prev) => (prev - 1 + items.length) % items.length)
    }, [items.length, pauseAutoRotation])

    // Auto-rotate effect (pauses on hover or user interaction)
    useEffect(() => {
        if (autoRotate && !isHovering && !isPaused) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % items.length)
            }, AUTO_ROTATE_INTERVAL)
            return () => clearInterval(interval)
        }
    }, [autoRotate, isHovering, isPaused, items.length])

    // --- Touch / Swipe Logic ---

    const onTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(null)
    }

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEndHandler = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd

        if (distance > MIN_SWIPE_DISTANCE) {
            handleNext()
        } else if (distance < -MIN_SWIPE_DISTANCE) {
            handlePrev()
        }
    }

    // --- 3D Carousel Style Calculator ---
    const getCardStyle = (index: number) => {
        const offset = (index - active + items.length) % items.length
        const base = "absolute w-full max-w-[340px] sm:max-w-[420px] md:max-w-[550px] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] origin-center will-change-transform"

        if (offset === 0) {
            return cn(base, "z-30 scale-100 opacity-100 translate-x-0")
        }
        if (offset === 1) {
            return cn(base, "z-20 scale-90 opacity-40 translate-x-[15%] translate-y-4 brightness-50 pointer-events-none")
        }
        if (offset === items.length - 1) {
            return cn(base, "z-20 scale-90 opacity-40 translate-x-[-15%] translate-y-4 brightness-50 pointer-events-none")
        }
        return cn(base, "z-0 scale-75 opacity-0 pointer-events-none")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-7xl mx-auto overflow-hidden"
            ref={carouselRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
        >
            {/* Cards Container */}
            <div className="relative h-[400px] sm:h-[620px] md:h-[580px] w-full flex items-center justify-center px-2 sm:px-4">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={getCardStyle(index)}
                        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                    >
                        <ProjectCard item={item} isActive={index === active} />
                    </div>
                ))}
            </div>
            <CarouselControls onPrev={handlePrev} onNext={handleNext} />
            <CarouselPagination total={items.length} active={active} onSelect={setActive} />
        </motion.div>
    )
}

// --- Sub-Components ---

function ProjectCard({ item, isActive }: { item: ProjectItem; isActive: boolean }) {
    return (
        <div
            className={cn(
                "h-[380px] sm:h-[580px] md:h-[540px] flex flex-col rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden transition-all duration-500",
                "bg-zinc-900 border border-white/10",
                isActive ? "" : "opacity-50"
            )}
        >
            {/* Image Section - Adjusted for desktop */}
            <div className="relative h-[40%] sm:h-[48%] md:h-[50%] w-full overflow-hidden bg-zinc-950">                {/* Efficient Background Aura (Low Quality, High Blur) */}
                {item.image && (
                    <div className="absolute inset-0 z-0 overflow-hidden opacity-20 select-none pointer-events-none">
                        <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                            quality={10} // Extremely low quality for blurred background saves bandwidth
                            className="object-cover scale-110 blur-3xl"
                        />
                    </div>
                )}

                {/* Main Project Visual (More Zoomed) */}
                {item.image ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className={cn(
                            "relative w-full h-full",
                            item.title === "Arkanoid Game"
                                ? "scale-x-125 scale-y-100 origin-center" // Stretch width only for Arkanoid
                                : item.title === "SpaceEase"
                                    ? "scale-110 sm:scale-115 md:scale-105" // Zoom out slightly for wide mockup
                                    : "scale-[1.65] sm:scale-[1.70] md:scale-[1.55]" // Default zoom
                        )}>
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                quality={75}
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                                priority={true}
                                loading="eager"
                            />
                        </div>

                        {/* Multi-directional Fade Overlays for Seamless Blend */}
                        {/* Top fade */}
                        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-zinc-950 to-transparent opacity-40 pointer-events-none z-20" />
                        {/* Bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-zinc-900 to-transparent opacity-70 pointer-events-none z-20" />
                        {/* Left fade */}
                        <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-zinc-950 to-transparent opacity-30 pointer-events-none z-20" />
                        {/* Right fade */}
                        <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-zinc-950 to-transparent opacity-30 pointer-events-none z-20" />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs font-mono tracking-widest uppercase">
                        Visual Optimized
                    </div>
                )}
            </div>

            {/* Project Content Section - Compact Flow Layout */}
            <div className="flex-1 p-4 sm:p-6 md:p-6 flex flex-col relative overflow-hidden">
                {/* Sophisticated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950 z-0" />

                <div className="relative z-10 space-y-1.5 sm:space-y-2.5 md:space-y-2">
                    <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                        <div className="space-y-0.5 sm:space-y-1">
                            <h3 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors duration-300">
                                {item.title}
                            </h3>
                            <span className="text-[10px] sm:text-[9px] md:text-xs font-bold text-indigo-400 uppercase tracking-wider sm:tracking-[0.2em]">
                                {item.category}
                            </span>
                        </div>
                        {item.github && (
                            <motion.a
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                href={item.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-lg"
                            >
                                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </motion.a>
                        )}
                    </div>
                    <p className="text-sm sm:text-sm md:text-base text-zinc-400 leading-snug sm:leading-relaxed md:leading-relaxed font-medium">
                        {item.description}
                    </p>
                </div>

                <div className="relative z-10 pt-3 sm:pt-4 md:pt-3 border-t border-white/5 mt-auto">
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
                        {item.techStack.slice(0, isActive ? 6 : 4).map((tech) => (
                            <span
                                key={tech}
                                className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded sm:rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] sm:text-[9px] md:text-xs font-bold border border-white/5 uppercase tracking-wide sm:tracking-wider"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CarouselControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
    return (
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-8 z-40 pointer-events-none">
            <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 h-14 w-14 transition-all shadow-xl"
                onClick={onPrev}
            >
                <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 h-14 w-14 transition-all shadow-xl"
                onClick={onNext}
            >
                <ChevronRight className="w-6 h-6" />
            </Button>
        </div>
    )
}

function CarouselPagination({ total, active, onSelect }: {
    total: number;
    active: number;
    onSelect: (idx: number) => void
}) {
    return (
        <div className="flex justify-center items-center gap-3 relative z-30 mt-4">
            {Array.from({ length: total }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        active === idx ? "bg-indigo-500 w-12" : "bg-zinc-800 w-3 hover:bg-zinc-700"
                    )}
                    aria-label={`Go to project ${idx + 1}`}
                />
            ))}
        </div>
    )
}
