"use client"

import { useRef, useEffect, useState, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight, Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

export function ProjectsCarousel({ items, autoRotate = false }: ProjectsCarouselProps) {
    const [active, setActive] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    useEffect(() => {
        if (autoRotate && !isHovering) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % items.length)
            }, 6000)
            return () => clearInterval(interval)
        }
    }, [autoRotate, isHovering, items.length])

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
        const minSwipeDistance = 50

        if (distance > minSwipeDistance) {
            setActive((prev) => (prev + 1) % items.length)
        } else if (distance < -minSwipeDistance) {
            setActive((prev) => (prev - 1 + items.length) % items.length)
        }
    }

    const getCardStyle = (index: number) => {
        const offset = (index - active + items.length) % items.length;

        // Card width is now 100% of its container on all screen sizes
        const base = "absolute w-full max-w-[440px] transition-all duration-500 ease-out origin-center will-change-transform backface-hidden";

        if (offset === 0) {
            return cn(base, "z-10 scale-100 opacity-100 translate-x-0 rotate-0");
        }
        if (offset === 1) {
            // Adjusted mobile translation for the new container width
            return cn(base, "z-0 scale-[0.8] md:scale-[0.92] opacity-50 md:opacity-60 translate-x-[30%] md:translate-x-[18%] rotate-0 md:-rotate-3 md:blur-[1px] pointer-events-none");
        }
        if (offset === items.length - 1) {
            // Adjusted mobile translation for the new container width
            return cn(base, "z-0 scale-[0.8] md:scale-[0.92] opacity-50 md:opacity-60 translate-x-[-30%] md:translate-x-[-18%] rotate-0 md:rotate-3 md:blur-[1px] pointer-events-none");
        }
        return cn(base, "z-[-1] scale-85 opacity-0 pointer-events-none");
    }

    return (
        <div
            className="relative w-full max-w-5xl mx-auto md:pt-0 overflow-hidden"
            ref={carouselRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
        >
            <div className="relative h-[480px] md:h-[500px] w-full flex items-center justify-center perspective-1000">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={getCardStyle(index)}
                        style={{
                            transformStyle: 'preserve-3d',
                            backfaceVisibility: 'hidden',
                            WebkitFontSmoothing: 'antialiased'
                        }}
                    >
                        <Card className="h-full bg-zinc-900 border border-white/10 overflow-hidden flex flex-col rounded-xl ring-1 ring-white/5">
                            <div className="relative border-b border-white/10 p-6 md:p-7 flex flex-col justify-end bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-900">
                                <div
                                    className="absolute inset-0 opacity-[0.2]"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165,180,252,0.15) 1px, transparent 0)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />

                                <div className="relative z-10 space-y-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-indigo-200/70">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold tracking-tight text-white/95 leading-tight">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            <CardContent className="flex-1 p-6 md:p-7 flex flex-col bg-zinc-900">
                                <p className="text-sm text-zinc-300/90 leading-relaxed font-light mb-6">
                                    {item.description}
                                </p>

                                <div className="space-y-5 md:space-y-6 mt-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {item.techStack.slice(0, 7).map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 px-2.5 py-1 text-[10px] font-mono tracking-wide rounded-md hover:border-indigo-500/30 transition-colors"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pt-4 md:pt-5 border-t border-white/5">
                                        {item.github && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="
                                                    border-zinc-700 bg-zinc-800/30 text-zinc-300
                                                    hover:bg-zinc-800 hover:text-white
                                                    text-xs font-medium h-10 md:h-11 rounded-xl
                                                    transform transition-all duration-300
                                                    hover:scale-[1.02] active:scale-95
                                                "
                                                asChild
                                            >
                                                <a href={item.github} target="_blank" rel="noopener noreferrer">
                                                    Source Code <Github className="w-3.5 h-3.5 ml-2 opacity-60" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between p-20 z-20 pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:inline-flex pointer-events-auto rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white backdrop-blur-md border border-white/10 h-12 w-12 transition-all hover:scale-110 active:scale-90"
                    onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:inline-flex pointer-events-auto rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white backdrop-blur-md border border-white/10 h-12 w-12 transition-all hover:scale-110 active:scale-90"
                    onClick={() => setActive((prev) => (prev + 1) % items.length)}
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>
            </div>

            <div className="flex justify-center items-center gap-2">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActive(idx)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            active === idx
                                ? "bg-indigo-500 w-6 md:w-8"
                                : "bg-zinc-700 w-1.5 hover:bg-zinc-600"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
