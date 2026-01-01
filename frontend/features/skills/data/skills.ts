import { Code2, Database, Sparkles } from "lucide-react"

export const skills = [
    {
        category: "Frontend & Mobile",
        icon: Code2,
        color: "from-blue-500 to-cyan-500",
        items: [
            { name: "React", level: "expert" },
            { name: "Next.js", level: "expert" },
            { name: "TypeScript", level: "expert" },
            { name: "Tailwind CSS", level: "expert" },
            { name: ".NET MAUI", level: "intermediate" },
            { name: "Framer Motion", level: "intermediate" },
        ],
    },
    {
        category: "Backend & Database",
        icon: Database,
        color: "from-emerald-500 to-teal-500",
        items: [
            { name: "Python", level: "expert" },
            { name: "FastAPI", level: "expert" },
            { name: "Node.js", level: "expert" },
            { name: "C# / .NET", level: "intermediate" },
            { name: "PostgreSQL", level: "expert" },
            { name: "MongoDB", level: "intermediate" },
        ],
    },
    {
        category: "AI & DevOps",
        icon: Sparkles,
        color: "from-purple-500 to-pink-500",
        items: [
            { name: "OpenAI API", level: "expert" },
            { name: "LangChain", level: "expert" },
            { name: "pgvector", level: "intermediate" },
            { name: "Docker", level: "intermediate" },
            { name: "Git / GitHub", level: "expert" },
            { name: "Vercel / Render", level: "expert" },
        ],
    },
]
