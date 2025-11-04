import type {ThreeDCarouselItem} from "@/features/projects/components/projects-carousel"

export const projects: ThreeDCarouselItem[] = [
    {
        id: 1,
        title: "AI Portfolio Chatbot",
        brand: "Personal Project",
        description:
            "An interactive portfolio website featuring an AI-powered chatbot built with FastAPI, OpenAI, and pgvector for semantic search capabilities.",
        tags: ["Next.js", "TypeScript", "FastAPI", "OpenAI", "PostgreSQL"],
        imageUrl: "/ai-chatbot-interface.png",
        link: "https://github.com/alexchen/ai-portfolio",
    },
    {
        id: 2,
        title: "E-Commerce Platform",
        brand: "Full-Stack Solution",
        description:
            "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
        tags: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
        imageUrl: "/modern-ecommerce-dashboard.png",
        link: "https://github.com/alexchen/ecommerce",
    },
    {
        id: 3,
        title: "Task Management App",
        brand: "Collaboration Tool",
        description:
            "A collaborative task management application with real-time updates, team workspaces, and advanced filtering.",
        tags: ["Next.js", "Prisma", "PostgreSQL", "WebSockets", "TailwindCSS"],
        imageUrl: "/task-management-kanban.png",
        link: "https://github.com/alexchen/taskmanager",
    },
    {
        id: 4,
        title: "Weather Dashboard",
        brand: "Data Visualization",
        description:
            "A beautiful weather dashboard with location-based forecasts, interactive maps, and historical data visualization.",
        tags: ["React", "TypeScript", "D3.js", "OpenWeather API"],
        imageUrl: "/weather-dashboard-interface.png",
        link: "https://github.com/alexchen/weather-dashboard",
    },
]