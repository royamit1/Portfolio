"use client"

import {ExternalLink, Github, ChevronLeft, ChevronRight, Code2, Zap} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useState, useEffect, useCallback} from "react"
import useEmblaCarousel from "embla-carousel-react"

interface Project {
    id: string
    name: string
    description: string
    techStack: string[]
    githubUrl?: string
    liveUrl?: string
}

const projects: Project[] = [
    {
        id: "1",
        name: "AI Portfolio Chatbot",
        description:
            "An interactive portfolio website featuring an AI-powered chatbot built with FastAPI, OpenAI, and pgvector for semantic search capabilities.",
        techStack: ["Next.js", "TypeScript", "FastAPI", "OpenAI", "PostgreSQL"],
        githubUrl: "https://github.com/alexchen/ai-portfolio",
        liveUrl: "https://alexchen.dev",
    },
    {
        id: "2",
        name: "E-Commerce Platform",
        description:
            "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
        techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
        githubUrl: "https://github.com/alexchen/ecommerce",
        liveUrl: "https://shop.alexchen.dev",
    },
    {
        id: "3",
        name: "Task Management App",
        description:
            "A collaborative task management application with real-time updates, team workspaces, and advanced filtering.",
        techStack: ["Next.js", "Prisma", "PostgreSQL", "WebSockets", "TailwindCSS"],
        githubUrl: "https://github.com/alexchen/taskmanager",
    },
    {
        id: "4",
        name: "Weather Dashboard",
        description:
            "A beautiful weather dashboard with location-based forecasts, interactive maps, and historical data visualization.",
        techStack: ["React", "TypeScript", "D3.js", "OpenWeather API"],
        githubUrl: "https://github.com/alexchen/weather-dashboard",
        liveUrl: "https://weather.alexchen.dev",
    },
]

export function ProjectCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: "start"})
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi, onSelect])

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full animate-fade-in-up" style={{animationDelay: "100ms", animationFillMode: "both"}}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-sidebar-accent to-sidebar-primary blur-md opacity-50"/>
                        <div
                            className="relative p-2.5 rounded-xl bg-gradient-to-br from-sidebar-accent/20 to-sidebar-primary/20 backdrop-blur-sm border border-sidebar-accent/30">
                            <Code2 className="h-5 w-5 text-sidebar-accent"/>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-chat-bot-fg">
                            Featured Projects
                        </h3>
                        <p className="text-xs text-chat-bot-fg/50 font-medium">
                            {selectedIndex + 1} / {projects.length}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={scrollPrev}
                        className="h-9 w-9 rounded-lg bg-sidebar-accent/10 hover:bg-sidebar-accent/20 transition-all duration-300 hover:scale-110 border border-sidebar-accent/20"
                    >
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={scrollNext}
                        className="h-9 w-9 rounded-lg bg-sidebar-accent/10 hover:bg-sidebar-accent/20 transition-all duration-300 hover:scale-110 border border-sidebar-accent/20"
                    >
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            {/* 3D Perspective Carousel Container */}
            <div className="relative" style={{perspective: "2000px"}}>
                {/* Ambient glow effects */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/5 via-sidebar-primary/5 to-sidebar-accent/5 blur-3xl opacity-50 rounded-3xl"/>

                <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
                    <div className="flex gap-6 py-8 px-2">
                        {projects.map((project, index) => {
                            const isActive = index === selectedIndex

                            return (
                                <div
                                    key={project.id}
                                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                                    style={{
                                        transform: isActive ? "scale(1)" : "scale(0.95)",
                                        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    }}
                                >
                                    {/* 3D Card with perspective */}
                                    <div
                                        className={`relative group h-full transition-all duration-700 ${
                                            isVisible ? "animate-slide-up-fade" : "opacity-0"
                                        }`}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animationFillMode: "both",
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        {/* Glowing border effect */}
                                        <div
                                            className="absolute -inset-0.5 bg-gradient-to-r from-sidebar-accent via-sidebar-primary to-sidebar-accent opacity-0 group-hover:opacity-30 blur-lg transition-all duration-700 rounded-2xl"/>

                                        {/* Main card */}
                                        <div
                                            className="relative h-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl rounded-2xl border border-sidebar-border/50 overflow-hidden group-hover:border-sidebar-accent/50 transition-all duration-500 group-hover:shadow-2xl">
                                            {/* Animated gradient overlay */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/0 via-sidebar-primary/5 to-sidebar-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>

                                            {/* Floating orbs */}
                                            <div
                                                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sidebar-accent/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
                                            <div
                                                className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sidebar-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"/>

                                            <div className="relative z-10 p-6 flex flex-col h-full">
                                                {/* Header with icons */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Zap className="h-4 w-4 text-sidebar-accent"/>
                                                            <h4 className="text-xl font-bold bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/70 bg-clip-text text-transparent group-hover:from-sidebar-accent group-hover:to-sidebar-primary transition-all duration-500">
                                                                {project.name}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-1.5 flex-shrink-0">
                                                        {project.githubUrl && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-lg bg-sidebar-accent/10 hover:bg-sidebar-accent/20 transition-all duration-300 hover:scale-125 hover:rotate-12 border border-sidebar-accent/20"
                                                                asChild
                                                            >
                                                                <a href={project.githubUrl} target="_blank"
                                                                   rel="noopener noreferrer">
                                                                    <Github className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">GitHub</span>
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {project.liveUrl && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-lg bg-sidebar-primary/10 hover:bg-sidebar-primary/20 transition-all duration-300 hover:scale-125 hover:-rotate-12 border border-sidebar-primary/20"
                                                                asChild
                                                            >
                                                                <a href={project.liveUrl} target="_blank"
                                                                   rel="noopener noreferrer">
                                                                    <ExternalLink className="h-3.5 w-3.5"/>
                                                                    <span className="sr-only">Live Demo</span>
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm text-sidebar-foreground/70 mb-5 leading-relaxed group-hover:text-sidebar-foreground/90 transition-colors duration-300 flex-grow">
                                                    {project.description}
                                                </p>

                                                {/* Tech Stack Pills */}
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="relative group/tag"
                                                        >
                                                            <span
                                                                className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/20 to-sidebar-primary/20 blur opacity-0 group-hover/tag:opacity-100 transition-opacity duration-300 rounded-lg"/>
                                                            <span
                                                                className="relative px-3 py-1.5 text-xs font-semibold bg-sidebar-accent/10 text-sidebar-accent-foreground rounded-lg border border-sidebar-accent/30 inline-block transition-all duration-300 hover:bg-sidebar-accent/20 hover:scale-105 hover:border-sidebar-accent/50 cursor-default">
                                                                {tech}
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Corner accent line */}
                                                <div
                                                    className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-sidebar-accent/20 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:h-24 group-hover:w-24"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Progress indicator with animation */}
                <div className="flex justify-center items-center gap-2 mt-6">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className="relative group/dot"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            {index === selectedIndex && (
                                <span className="absolute inset-0 bg-sidebar-accent blur-md opacity-50"/>
                            )}
                            <span
                                className={`relative block h-2 rounded-full transition-all duration-500 ${
                                    index === selectedIndex
                                        ? "w-10 bg-gradient-to-r from-sidebar-accent to-sidebar-primary"
                                        : "w-2 bg-sidebar-accent/20 group-hover/dot:bg-sidebar-accent/40 group-hover/dot:w-6"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
