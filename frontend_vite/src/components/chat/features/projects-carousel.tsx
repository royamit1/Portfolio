"use client"

import {useRef, useEffect, useState, type TouchEvent} from "react"
import {ChevronLeft, ChevronRight, ArrowRight} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card.tsx"
import {useIsMobile} from "@/hooks/use-mobile.tsx"

export interface ThreeDCarouselItem {
    id: number
    title: string
    brand: string
    description: string
    tags: string[]
    imageUrl: string
    link: string
}

interface ThreeDCarouselProps {
    items: ThreeDCarouselItem[]
    autoRotate?: boolean
    rotateInterval?: number
    cardHeight?: { base: number; md: number }
    title?: string
    subtitle?: string
    tagline?: string
    isMobileSwipe?: boolean
}

const getThemedBackground = (index: number) => {
    const themes = [
        "bg-gradient-to-br from-slate-800 to-indigo-900",
        "bg-gradient-to-r from-stone-700 to-amber-900",
        "bg-gradient-to-tl from-cyan-700 to-teal-800",
        "bg-gradient-to-bl from-gray-600 to-slate-500",
        "bg-gradient-to-tr from-fuchsia-800 to-purple-900",
    ];
    return themes[index % themes.length];
};


const ThreeDCarousel = ({
                            items,
                            autoRotate,
                            rotateInterval,
                            cardHeight = {base: 400, md: 500},
                            title,
                            subtitle,
                            tagline,
                            isMobileSwipe = true,
                        }: ThreeDCarouselProps) => {
    const [active, setActive] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const isMobile = useIsMobile()
    const minSwipeDistance = 50

    useEffect(() => {
        if (carouselRef.current) {
            const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {threshold: 0.2})
            observer.observe(carouselRef.current)
            return () => observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (autoRotate && isInView && !isHovering) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % items.length)
            }, rotateInterval)
            return () => clearInterval(interval)
        }
    }, [isInView, isHovering, autoRotate, rotateInterval, items.length])

    const onTouchStart = (e: TouchEvent) => {
        if (!isMobileSwipe) return
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(null)
    }

    const onTouchMove = (e: TouchEvent) => {
        if (!isMobileSwipe) return
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEndHandler = () => {
        if (!isMobileSwipe || !touchStart || !touchEnd) return
        const distance = touchStart - touchEnd

        if (distance > minSwipeDistance) {
            setActive((prev) => (prev + 1) % items.length)
        } else if (distance < -minSwipeDistance) {
            setActive((prev) => (prev - 1 + items.length) % items.length)
        }
    }

    const getCardAnimationClass = (index: number) => {
        if (index === active) return "scale-100 opacity-100 z-30 brightness-105 pointer-events-auto"
        if (index === (active + 1) % items.length)
            return "translate-x-[45%] scale-[0.85] opacity-50 z-10 blur-[2px] brightness-75 pointer-events-none"
        if (index === (active - 1 + items.length) % items.length)
            return "translate-x-[-45%] scale-[0.85] opacity-50 z-10 blur-[2px] brightness-75 pointer-events-none"
        return "scale-75 opacity-0 pointer-events-none"
    }

    const currentCardHeight = isMobile ? cardHeight.base : cardHeight.md;

    return (
        <section
            id="ThreeDCarousel"
            className="relative w-full max-w-4xl flex flex-col items-center justify-center px-4 py-6 rounded-3xl
             bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden font-sans"
        >

            <div
                className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/10 pointer-events-none"/>

            <div className="text-center mb-10 px-6 max-w-4xl relative z-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-400 mb-4">
                    {subtitle}
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                    {title}
                </h2>
                <p className="text-lg text-gray-300 mx-auto leading-relaxed max-w-3xl">
                    {tagline}
                </p>
                <div
                    className="mt-6 mx-auto w-56 h-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent rounded-full"/>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                <div
                    className="relative overflow-hidden h-[450px] md:h-[550px]"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEndHandler}
                    ref={carouselRef}
                >
                    <div className="absolute w-full h-full flex items-center justify-center">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(
                                    index,
                                )}`}
                            >
                                <Card
                                    style={{height: `${currentCardHeight}px`}}
                                    className="overflow-hidden bg-gray-800 border border-transparent outline-none flex flex-col transition-shadow duration-300"
                                >

                                    <div
                                        className={`relative flex items-center justify-center h-48 overflow-hidden ${getThemedBackground(index)}`}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-20 bg-[url('https://api.iconify.design/pixelarticons:dots-grid.svg?color=white')] bg-repeat bg-opacity-10 pointer-events-none"/>

                                        <div className="relative z-10 text-center text-white drop-shadow-2xl">
                                            <h3 className="text-3xl font-bold tracking-tight mb-3 text-balance">
                                                {item.brand.toUpperCase()}
                                            </h3>
                                            <div
                                                className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-3 opacity-80"/>
                                            <p className="text-sm text-gray-100 font-medium px-4">{item.title}</p>
                                        </div>
                                    </div>

                                    <CardContent className="px-6 py-3 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-1 text-white">{item.title}</h3>
                                        <p className="text-gray-400 text-sm font-medium mb-2">{item.brand}</p>
                                        <p className="text-gray-300 text-sm flex-grow leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="mt-4">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {item.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded-full text-xs font-medium"
                                                    >
                                                        {tag}
                                                      </span>
                                                ))}
                                            </div>

                                            <a
                                                href={item.link}
                                                className="text-slate-400 flex items-center group relative text-sm font-medium"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="relative z-10">View on LinkedIn</span>
                                                <ArrowRight
                                                    className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1"/>
                                                <span
                                                    className="absolute left-0 bottom-0 w-0 h-0.5 bg-slate-400 transition-all duration-300 group-hover:w-28"/>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {!isMobile && (
                        <>
                            <button
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                           bg-gray-800/70 backdrop-blur-md text-white
                           hover:bg-gray-800 transition-all duration-300 shadow-xl
                           flex items-center justify-center hover:scale-105 z-40
                           border border-gray-700"
                                onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </button>

                            <button
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                           bg-gray-800/70 backdrop-blur-md text-white
                           hover:bg-gray-800 transition-all duration-300 shadow-xl
                           flex items-center justify-center hover:scale-105 z-40
                           border border-gray-700"
                                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-slate-500
                           ${
                                    active === idx
                                        ? "bg-slate-600 w-8"
                                        : "bg-gray-500/30 w-2 hover:bg-gray-500/60"
                                }`}
                                onClick={() => setActive(idx)}
                                aria-label={`Go to item ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ThreeDCarousel
