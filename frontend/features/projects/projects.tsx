import type { ProjectItem } from "@/features/projects/components/projects-carousel";

export const projects: ProjectItem[] = [
    {
        id: 1,
        title: "AI Portfolio & Digital Twin",
        category: "Full-Stack Generative AI",
        description:
            "A custom-built RAG system acting as my 'Digital Twin.' It uses Hybrid Search (Vector + Keyword) to answer questions about my career, featuring a 'Transparent AI' interface that visualizes its thinking process in real-time.",
        techStack: ["FastAPI", "Next.js", "LangChain", "pgvector"],
        github: "https://github.com/royamit1/Portfolio",
    },
    {
        id: 2,
        title: "SpaceEase",
        category: "Full-Stack Web App",
        description:
            "A two-sided marketplace to alleviate the urban parking crisis by connecting property owners with drivers. It handles discovery via interactive maps, real-time booking, and availability management.",
        techStack: ["Next.js", "Supabase", "PostGIS", "Prisma"],
        github: "https://github.com/royamit1/space-ease",
    },
    {
        id: 3,
        title: "Yeet! Chat",
        category: "Cross-Platform System",
        description:
            "A comprehensive instant messaging ecosystem accessible via Web and Mobile. It features a unified Node.js backend serving two distinct clients: a React app using WebSockets and a native Android app using Firebase (FCM).",
        techStack: ["React", "Android (Java)", "Node.js", "Socket.IO"],
        github: "https://github.com/aliktepl/yeet-chat-application",
    },
    {
        id: 4,
        title: "News Broadcaster",
        category: "Concurrent Systems (C)",
        description:
            "A simulation of a news broadcasting system demonstrating mastery of concurrent programming. It models a producer-consumer pipeline using Semaphores and Mutexes to prevent race conditions and deadlocks.",
        techStack: ["C", "Linux", "pthreads", "Semaphores"],
        github: "https://github.com/royamit1/Producer-Consumer",
    },
    {
        id: 5,
        title: "KNN Classifier",
        category: "Networked C++ App",
        description:
            "A high-performance, multi-threaded server that implements the K-Nearest Neighbors (KNN) algorithm from scratch in C++. It serves multiple concurrent clients over TCP sockets for real-time classification.",
        techStack: ["C++", "TCP/IP", "pthreads", "Design Patterns"],
        github: "https://github.com/royamit1/KNN-Classifier-Server",
    },
];
