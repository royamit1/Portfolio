import { useEffect, useState } from 'react'
import ProjectsHeader from './ProjectHeader.tsx'
import ProjectsGrid from './ProjectGrid.tsx'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8000/api/projects")
            .then((res) => res.json())
            .then((data) => {
                setProjects(data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600">Loading amazing projects...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
                <ProjectsHeader projectCount={projects.length} />
                <ProjectsGrid projects={projects} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://github.com/royamit1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-300 shadow-sm"
                    >
                        View All Projects on GitHub
                    </a>
                </motion.div>
            </div>
        </section>
    )
}