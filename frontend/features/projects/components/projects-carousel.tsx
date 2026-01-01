"use client"

import React, {useState, useEffect, useRef, useCallback, type TouchEvent} from "react"
import {motion} from "framer-motion"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {FaGithub} from "react-icons/fa"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"

// --- Types ---

export interface ProjectItem {
    id: number
    title: string
    category: string
    description: string
    techStack: string[]
    link?: string
    github?: string
}

interface ProjectsCarouselProps {
    items: ProjectItem[]
    autoRotate?: boolean
}

// --- Constants ---

const AUTO_ROTATE_INTERVAL = 6000
const MIN_SWIPE_DISTANCE = 50

export function ProjectsCarousel({items, autoRotate = false}: ProjectsCarouselProps) {
    const [active, setActive] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const carouselRef = useRef<HTMLDivElement>(null)

    // --- Navigation Logic ---

    const handleNext = useCallback(() => {
        setActive((prev) => (prev + 1) % items.length)
    }, [items.length])

    const handlePrev = useCallback(() => {
        setActive((prev) => (prev - 1 + items.length) % items.length)
    }, [items.length])

    // Auto-rotate effect (pauses on hover)
    useEffect(() => {
        if (autoRotate && !isHovering) {
            const interval = setInterval(handleNext, AUTO_ROTATE_INTERVAL)
            return () => clearInterval(interval)
        }
    }, [autoRotate, isHovering, handleNext])

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
    // Determines the position, scale, and opacity of a card based on its distance from the active index.
    const getCardStyle = (index: number) => {
        const offset = (index - active + items.length) % items.length
        const base = "absolute w-full max-w-[480px] transition-all duration-700 ease-out origin-center will-change-transform"

        // Active Card (Center)
        if (offset === 0) {
            return cn(base, "z-20 scale-100 opacity-100 translate-x-0 rotate-0 translate-y-0")
        }

        // Next Card (Right Stack)
        if (offset === 1) {
            return cn(base, "z-10 scale-90 opacity-40 translate-x-[35%] md:translate-x-[25%] rotate-0 md:rotate-2 translate-y-4 blur-[1px] pointer-events-none")
        }

        // Previous Card (Left Stack)
        if (offset === items.length - 1) {
            return cn(base, "z-10 scale-90 opacity-40 translate-x-[-35%] md:translate-x-[-25%] rotate-0 md:-rotate-2 translate-y-4 blur-[1px] pointer-events-none")
        }

        // Hidden Cards
        return cn(base, "z-0 scale-75 opacity-0 pointer-events-none")
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="relative w-full max-w-6xl mx-auto overflow-hidden pb-4"
            ref={carouselRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
        >
            {/* Cards Container */}
            <div className="relative h-[450px] md:h-[500px] w-full flex items-center justify-center">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={getCardStyle(index)}
                        style={{transformStyle: "preserve-3d", backfaceVisibility: "hidden"}}
                    >
                        <ProjectCard item={item} isActive={index === active}/>
                    </div>
                ))}
            </div>

            <CarouselControls onPrev={handlePrev} onNext={handleNext}/>
            <CarouselPagination total={items.length} active={active} onSelect={setActive}/>
        </motion.div>
    )
}

// --- Sub-Components ---

function ProjectCard({item, isActive}: { item: ProjectItem; isActive: boolean }) {
    return (
        <Card
            className={cn(
                "h-full overflow-hidden flex flex-col rounded-2xl transition-all duration-700 mb-4 md:mb-6",
                "bg-gradient-to-br from-zinc-900/95 via-zinc-900/98 to-black/95",
                "border border-white/10 backdrop-blur-xl",
                "shadow-2xl shadow-black/50",
                isActive && "ring-1 ring-white/20",
            )}
        >
            {/* Header / Banner */}
            <div
                className="relative border-b border-white/10 p-6 md:p-8 bg-gradient-to-br from-indigo-800/5 via-indigo-500/15 to-transparent overflow-hidden">
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500/90 rounded-full animate-pulse"/>
                        <span
                            className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-indigo-300/70 font-medium">
                            {item.category}
                        </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight text-balance">
                        {item.title}
                    </h3>
                </div>
            </div>

            {/* Content Body */}
            <CardContent className="flex-1 p-6 md:p-8 flex flex-col bg-zinc-900">
                <p className="text-sm md:text-base text-zinc-300/95 leading-relaxed mb-6 line-clamp-4 text-pretty">
                    {item.description}
                </p>

                <div className="space-y-6 mt-auto">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                            {item.techStack.map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="bg-zinc-800/50 text-zinc-300 border border-white/5 px-3 py-1.5 text-xs font-medium rounded-lg"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {item.github && (
                        <Button
                            size="sm"
                            className="w-full h-11 rounded-xl font-medium text-sm bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10"
                            asChild
                        >
                            <a href={item.github} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center gap-2">
                                <FaGithub className="w-4 h-4"/>
                                View Source Code
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function CarouselControls({onPrev, onNext}: { onPrev: () => void; onNext: () => void }) {
    return (
        <div
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-4 md:px-8 z-30 pointer-events-none">
            <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 h-11 w-11 md:h-14 md:w-14 transition-all duration-300"
                onClick={onPrev}
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6"/>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="pointer-events-auto rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 h-11 w-11 md:h-14 md:w-14 transition-all duration-300"
                onClick={onNext}
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6"/>
            </Button>
        </div>
    )
}

function CarouselPagination({total, active, onSelect}: {
    total: number;
    active: number;
    onSelect: (idx: number) => void
}) {
    return (
        <div className="flex justify-center items-center gap-2.5 relative z-20">
            {Array.from({length: total}).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        active === idx ? "bg-indigo-500 w-10" : "bg-zinc-700 w-2 hover:bg-zinc-600"
                    )}
                    aria-label={`Go to project ${idx + 1}`}
                />
            ))}
        </div>
    )
}