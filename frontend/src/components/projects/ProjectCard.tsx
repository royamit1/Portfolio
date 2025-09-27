import { ExternalLink, Github, Code } from 'lucide-react'
import type { Project } from './types/project'

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {project.title}
                    </h3>
                    {project.contribution && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                            Contributor
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px]">
                    {project.description}
                </p>
            </div>

            {/* Technology & Language */}
            <div className="px-6 pb-4">
                <div className="flex items-center gap-2 mb-4">
                    {project.language && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            <Code size={12} />
                            {project.language}
                        </div>
                    )}

                    {project.tech && project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {project.tech.slice(0, 3).map((tech, techIndex) => (
                                <span
                                    key={techIndex}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                            {project.tech.length > 3 && (
                                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-xs">
                                    +{project.tech.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4">
                <div className="flex gap-3">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex-1 justify-center"
                        data-testid={`project-github-${index}`}
                    >
                        <Github size={16} />
                        GitHub
                    </a>

                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex-1 justify-center"
                            data-testid={`project-live-${index}`}
                        >
                            <ExternalLink size={16} />
                            Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}