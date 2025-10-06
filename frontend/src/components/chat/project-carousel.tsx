"use client"

import type React from "react"
import {useCallback, useEffect, useState} from "react"
import useEmblaCarousel from "embla-carousel-react"
import {motion, useMotionValue, useSpring, useTransform} from "framer-motion"
import {ExternalLink, Github, ChevronLeft, ChevronRight} from "lucide-react"

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
            "An interactive portfolio with an AI-powered chatbot built using FastAPI, OpenAI, and PostgreSQL.",
        techStack: ["Next.js", "TypeScript", "FastAPI", "OpenAI", "PostgreSQL"],
        githubUrl: "#",
        liveUrl: "#",
    },
    {
        id: "2",
        name: "E-Commerce Platform",
        description:
            "Full-stack e-commerce solution with inventory management, payments, and an admin dashboard.",
        techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
        githubUrl: "#",
        liveUrl: "#",
    },
    {
        id: "3",
        name: "Task Manager",
        description:
            "A collaborative task management app with team workspaces and real-time updates.",
        techStack: ["Next.js", "Prisma", "PostgreSQL", "WebSockets"],
        githubUrl: "#",
    },
]

function ProjectCard({
                         project,
                         index,
                         activeIndex,
                     }: {
    project: Project
    index: number
    activeIndex: number
}) {
    const [isHovered, setIsHovered] = useState(false)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
        stiffness: 300,
        damping: 30,
    })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
        stiffness: 300,
        damping: 30,
    })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isHovered) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
    }

    const distance = Math.abs(index - activeIndex)
    const isActive = distance === 0
    const isAdjacent = distance === 1

    const getTransform = () => {
        if (isActive) return {scale: 1, opacity: 1, z: 0, rotateY: 0, blur: 0}
        if (isAdjacent) {
            const direction = index > activeIndex ? 1 : -1
            return {
                scale: 0.9,
                opacity: 0.7,
                z: -100,
                rotateY: direction * 12,
                blur: 1,
            }
        }
        const direction = index > activeIndex ? 1 : -1
        return {
            scale: 0.75,
            opacity: 0.3,
            z: -200,
            rotateY: direction * 20,
            blur: 2,
        }
    }

    const transform = getTransform()

    const baseRotateY = transform.rotateY
    const parallaxRotateY = useTransform(
        rotateY,
        (value) => baseRotateY + (isHovered ? value : 0)
    )
    const parallaxRotateX = useTransform(rotateX, (value) =>
        isHovered ? value : 0
    )

    return (
        <motion.div
            className="embla__slide flex-[0_0_100%] md:flex-[0_0_70%] lg:flex-[0_0_50%] px-4"
            initial={{opacity: 0, y: 30}}
            animate={{
                opacity: transform.opacity,
                scale: transform.scale,
                z: transform.z,
                filter: `blur(${transform.blur}px)`,
            }}
            style={{
                rotateY: parallaxRotateY,
                rotateX: parallaxRotateX,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`relative h-full rounded-xl border bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-md transition-all duration-500 p-6 ${
                    isActive ? "border-indigo-500/40" : "border-neutral-200 dark:border-neutral-800"
                }`}
            >
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                    {project.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
              {tech}
            </span>
                    ))}
                </div>
                <div className="flex gap-3">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub link"
                            className="text-neutral-500 hover:text-indigo-500 transition-colors"
                        >
                            <Github size={18}/>
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live link"
                            className="text-neutral-500 hover:text-indigo-500 transition-colors"
                        >
                            <ExternalLink size={18}/>
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export function ProjectCarousel3D() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        skipSnaps: false,
    })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

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

    return (
        <div className="w-full">
            <h3 className="text-center text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                Featured Projects
            </h3>

            <div className="relative" style={{perspective: "2000px"}}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                activeIndex={selectedIndex}
                            />
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border rounded-full shadow-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                    <ChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300"/>
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border rounded-full shadow-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                    <ChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300"/>
                </button>
            </div>
        </div>
    )
}
