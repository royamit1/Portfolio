"use client"

import {ExternalLink, Github, Sparkles} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useState, useEffect} from "react"

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

export function ProjectCards() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full space-y-4 animate-fade-in-up"
             style={{animationDelay: '100ms', animationFillMode: 'both'}}>
            {/* Agent Message Container with distinct styling */}
            <div
                className="bg-gradient-to-br from-chat-bot-bg/40 via-chat-bot-bg/30 to-chat-bot-bg/20 rounded-2xl p-8 border border-chat-bot-bg/40 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Decorative elements */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sidebar-accent/10 to-transparent rounded-full blur-3xl pointer-events-none"/>
                <div
                    className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sidebar-accent/5 to-transparent rounded-full blur-2xl pointer-events-none"/>

                {/* Header with icon */}
                <div className="relative z-10 flex items-center gap-3 mb-8">
                    <div
                        className="p-3 rounded-xl bg-sidebar-accent/20 backdrop-blur-sm border border-sidebar-accent/30 shadow-lg">
                        <Sparkles className="h-6 w-6 text-sidebar-accent"/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-chat-bot-fg bg-gradient-to-r from-chat-bot-fg to-chat-bot-fg/70 bg-clip-text">
                            My Projects
                        </h3>
                        <p className="text-sm text-chat-bot-fg/60 mt-1">
                            Here's a showcase of my recent work
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm rounded-2xl p-6 border border-sidebar-border/30 hover:border-sidebar-accent/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] group relative overflow-hidden ${
                                isVisible ? 'animate-slide-up-fade' : 'opacity-0'
                            }`}
                            style={{
                                animationDelay: `${index * 150}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            {/* Gradient overlay on hover */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/0 via-sidebar-accent/5 to-sidebar-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"/>

                            {/* Glow effect */}
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-sidebar-accent/20 via-sidebar-accent/10 to-sidebar-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"/>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="text-xl font-bold text-sidebar-foreground group-hover:text-sidebar-accent transition-colors duration-300 pr-2">
                                        {project.name}
                                    </h4>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {project.githubUrl && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-125 hover:rotate-12 hover:bg-sidebar-accent/20 rounded-xl"
                                                asChild
                                            >
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-4 w-4"/>
                                                    <span className="sr-only">GitHub</span>
                                                </a>
                                            </Button>
                                        )}
                                        {project.liveUrl && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-125 hover:-rotate-12 hover:bg-sidebar-accent/20 rounded-xl"
                                                asChild
                                            >
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4"/>
                                                    <span className="sr-only">Live Demo</span>
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-sidebar-foreground/70 mb-5 leading-relaxed group-hover:text-sidebar-foreground/85 transition-colors duration-300">
                                    {project.description}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech, techIndex) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 text-xs font-semibold bg-sidebar-accent/15 text-sidebar-accent-foreground rounded-lg border border-sidebar-accent/30 transition-all duration-300 hover:bg-sidebar-accent/25 hover:scale-105 hover:shadow-md cursor-default animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 150 + techIndex * 50}ms`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Decorative corner accent */}
                                <div
                                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-sidebar-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}