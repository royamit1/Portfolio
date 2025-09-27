import { motion } from 'framer-motion'
import { Folder, Star } from 'lucide-react'

interface ProjectsHeaderProps {
    projectCount: number;
}

export default function ProjectsHeader({ projectCount }: ProjectsHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
            >
                <Folder className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                data-testid="projects-title"
            >
                Featured Projects
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mb-6"
                data-testid="projects-subtitle"
            >
                A curated collection of my software development projects, showcasing various technologies and problem-solving approaches.
            </motion.p>

            {projectCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                    <Star size={16} fill="currentColor" />
                    {projectCount} Project{projectCount !== 1 ? 's' : ''} Featured
                </motion.div>
            )}
        </motion.div>
    )
}