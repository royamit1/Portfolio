import { Code2, Database, Wrench, Layers } from "lucide-react"

export const skills = [
    {
        category: "Programming Languages",
        icon: Code2,
        color: "from-slate-400 to-slate-500",
        items: [
            { name: "C#", level: "expert" },
            { name: "TypeScript", level: "expert" },
            { name: "Java", level: "expert" },
            { name: "JavaScript", level: "expert" },
        ],
    },
    {
        category: "Technologies",
        icon: Layers,
        color: "from-zinc-400 to-zinc-500",
        items: [
            { name: "React", level: "expert" },
            { name: "Next.js", level: "expert" },
            { name: ".NET MAUI", level: "intermediate" },
            { name: "Node.js", level: "expert" },
        ],
    },
    {
        category: "Database & ORM",
        icon: Database,
        color: "from-neutral-400 to-neutral-500",
        items: [
            { name: "PostgreSQL", level: "expert" },
            { name: "Drizzle ORM", level: "intermediate" },
            { name: "Supabase", level: "expert" },
        ],
    },
    {
        category: "Tools",
        icon: Wrench,
        color: "from-gray-400 to-gray-500",
        items: [
            { name: "GitHub", level: "expert" },
            { name: "Jira", level: "intermediate" },
            { name: "Vercel", level: "expert" },
            { name: "Zustand", level: "expert" },
        ],
    },
]
