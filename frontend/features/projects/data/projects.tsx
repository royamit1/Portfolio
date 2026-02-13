import type { ProjectItem } from "@/features/projects/components/projects-carousel";

export const projects: ProjectItem[] = [
    {
        id: 1,
        title: "AI Portfolio Assistant",
        category: "Full-Stack Generative AI",
        description:
            "A custom RAG system answering questions about my career. Features Hybrid Search for accuracy and a Transparent AI interface streaming real-time thought processes.",
        techStack: ["FastAPI", "Next.js", "LangChain", "pgvector"],
        github: "https://github.com/royamit1/Portfolio",
        image: "/images/projects/ai-portfolio.webp",
    },
    {
        id: 2,
        title: "SpaceEase",
        category: "Full-Stack Web App",
        description:
            "A parking marketplace connecting owners with drivers. Uses PostGIS for geospatial discovery and Supabase for real-time updates and optimistic UI.",
        techStack: ["Next.js", "Supabase", "PostGIS", "Prisma"],
        github: "https://github.com/royamit1/space-ease",
        image: "/images/projects/space-ease.webp",
    },
    {
        id: 3,
        title: "Yeet! Chat",
        category: "Cross-Platform System",
        description:
            "Unified messaging across Web and Android. Powered by Node.js with WebSockets for real-time chat and Firebase Cloud Messaging for mobile push notifications.",
        techStack: ["React", "Android (Java)", "Node.js", "Socket.IO"],
        github: "https://github.com/aliktepl/yeet-chat-application",
        image: "/images/projects/yeet-chat.webp",
    },
    {
        id: 4,
        title: "News Broadcaster",
        category: "Concurrent Systems (C)",
        description:
            "A concurrent Producer-Consumer simulation. orchestrates a 4-stage pipeline using pthreads, semaphores, and mutexes with round-robin scheduling.",
        techStack: ["C", "Linux", "pthreads", "Semaphores"],
        github: "https://github.com/royamit1/Producer-Consumer",
        image: "/images/projects/news-broadcaster.webp",
    },
    {
        id: 5,
        title: "KNN Classifier",
        category: "Networked C++ App",
        description:
            "Multi-threaded classification server implementing K-Nearest Neighbors. Designed with Command and Strategy patterns for extensible, transport-agnostic operations.",
        techStack: ["C++", "TCP/IP", "pthreads", "Design Patterns"],
        github: "https://github.com/royamit1/KNN-Classifier-Server",
        image: "/images/projects/knn-classifier.webp",
    },
    {
        id: 6,
        title: "Arkanoid Game",
        category: "Game Development",
        description:
            "Classic arcade recreation showcasing advanced OOP. Features Observer pattern for collisions, Strategy for level configs, and a decoupled game loop.",
        techStack: ["Java", "OOP", "Design Patterns", "Game Loop"],
        github: "https://github.com/royamit1/Brick-Breaker",
        image: "/images/projects/arkanoid.webp",
    },
];
