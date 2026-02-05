import type { ProjectItem } from "@/features/projects/components/projects-carousel";

export const projects: ProjectItem[] = [
    {
        id: 1,
        title: "AI Portfolio Assistant",
        category: "Full-Stack Generative AI",
        description:
            "An interactive portfolio powered by a custom RAG system that answers questions about my career. Built with Hybrid Search combining vector similarity and keyword matching for accurate retrieval, and a Transparent AI interface that streams the thinking process in real-time via Server-Sent Events.",
        techStack: ["FastAPI", "Next.js", "LangChain", "pgvector"],
        github: "https://github.com/royamit1/Portfolio",
        image: "/images/projects/ai-portfolio.png",
    },
    {
        id: 2,
        title: "SpaceEase",
        category: "Full-Stack Web App",
        description:
            "A two-sided marketplace connecting parking space owners with drivers. Implements geospatial queries via PostGIS for location-based discovery, real-time availability updates through Supabase subscriptions, and an optimistic UI architecture for instant user feedback.",
        techStack: ["Next.js", "Supabase", "PostGIS", "Prisma"],
        github: "https://github.com/royamit1/space-ease",
        image: "/images/projects/space-ease.png",
    },
    {
        id: 3,
        title: "Yeet! Chat",
        category: "Cross-Platform System",
        description:
            "A cross-platform messaging app with web and Android clients sharing a unified Node.js backend. Implements WebSockets for real-time web communication, Firebase Cloud Messaging for mobile push notifications, and Room database for offline-first persistence on Android.",
        techStack: ["React", "Android (Java)", "Node.js", "Socket.IO"],
        github: "https://github.com/aliktepl/yeet-chat-application",
        image: "/images/projects/yeet-chat.png",
    },
    {
        id: 4,
        title: "News Broadcaster",
        category: "Concurrent Systems (C)",
        description:
            "A concurrent simulation of a news broadcasting pipeline demonstrating the Producer-Consumer pattern. Features a 4-stage thread architecture with custom bounded buffers synchronized via semaphores and mutexes, round-robin scheduling for fairness, and sentinel-based graceful shutdown.",
        techStack: ["C", "Linux", "pthreads", "Semaphores"],
        github: "https://github.com/royamit1/Producer-Consumer",
        image: "/images/projects/news-broadcaster.png",
    },
    {
        id: 5,
        title: "KNN Classifier",
        category: "Networked C++ App",
        description:
            "A multi-threaded classification server implementing K-Nearest Neighbors from scratch over TCP sockets. Designed with Command and Strategy patterns for extensibility, featuring abstract I/O for transport-agnostic operations and 5 configurable distance metrics.",
        techStack: ["C++", "TCP/IP", "pthreads", "Design Patterns"],
        github: "https://github.com/royamit1/KNN-Classifier-Server",
        image: "/images/projects/knn-classifier.png",
    },
    {
        id: 6,
        title: "Arkanoid Game",
        category: "Game Development",
        description:
            "A recreation of the classic Arkanoid arcade game showcasing advanced OOP principles. Implements Observer pattern for event-driven collision handling, Strategy pattern for level configuration, and a decoupled game loop architecture across 4 uniquely themed levels.",
        techStack: ["Java", "OOP", "Design Patterns", "Game Loop"],
        github: "https://github.com/royamit1/Brick-Breaker",
        image: "/images/projects/arkanoid.png",
    },
];
