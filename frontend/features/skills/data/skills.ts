import { Code2, Database, Wrench, Layers } from "lucide-react"

export const skills = [
    {
        category: "Programming Languages",
        icon: Code2,
        color: "from-slate-400 to-slate-500",
        items: [
            { name: "C#" },
            { name: "TypeScript" },
            { name: "Java" },
            { name: "JavaScript" },
        ],
    },
    {
        category: "Technologies",
        icon: Layers,
        color: "from-zinc-400 to-zinc-500",
        items: [
            { name: "React" },
            { name: "Next.js" },
            { name: ".NET MAUI" },
            { name: "Node.js" },
        ],
    },
    {
        category: "Database & ORM",
        icon: Database,
        color: "from-neutral-400 to-neutral-500",
        items: [
            { name: "PostgreSQL" },
            { name: "Drizzle ORM" },
            { name: "Supabase" },
        ],
    },
    {
        category: "Tools",
        icon: Wrench,
        color: "from-gray-400 to-gray-500",
        items: [
            { name: "GitHub" },
            { name: "Jira" },
            { name: "Vercel" },
            { name: "Zustand" },
        ],
    },
]
