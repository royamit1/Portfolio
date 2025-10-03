"use client"

import {Button} from "@/components/ui/button"
import {Code2, Briefcase, FileText, Trash2, Github, Linkedin, Mail} from "lucide-react"
import type {Topic} from "@/lib/types"

interface SidebarProps {
    onTopicSelect: (topic: Topic) => void
    onClearChat: () => void
}

export function Sidebar({onTopicSelect, onClearChat}: SidebarProps) {
    const topics = [
        {id: "projects" as Topic, label: "Projects", icon: Code2},
        {id: "skills" as Topic, label: "Skills", icon: Briefcase},
        {id: "resume" as Topic, label: "Resume", icon: FileText},
    ]

    return (
        <aside className="w-64 lg:w-80 border-r border-sidebar-border bg-sidebar flex flex-col">
            <div className="mb-8 border-b border-sidebar-border/50">
                <div className="relative group p-6">
                    <div className="relative z-10">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className="h-1 w-12 bg-gradient-to-r from-sidebar-accent to-transparent rounded-full"/>
                                <div className="h-1 w-6 bg-sidebar-accent/50 rounded-full"/>
                            </div>

                            <h1 className="text-5xl font-black text-sidebar-foreground tracking-tight mb-1 bg-gradient-to-r from-sidebar-foreground via-sidebar-foreground to-sidebar-foreground/70 bg-clip-text">
                                Roy Amit
                            </h1>

                            <div className="flex my-2">
                                <span
                                    className="py-3 text-s font-bold bg-sidebar-accent/20 text-sidebar-accent-foreground rounded-full border border-sidebar-accent/30">
                                    Full-Stack Developer
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-sidebar-foreground/80 leading-relaxed font-medium">
                            Crafting elegant solutions with modern technologies. Passionate about AI, web
                            development, and creating impactful user experiences.
                        </p>
                    </div>
                </div>
            </div>

            <nav className="relative z-10 flex-1 space-y-3 pl-3 pr-8">
                <p className="text-xs font-bold text-sidebar-foreground/50 mb-5 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-3 bg-sidebar-accent/30"/>
                    Quick Access
                </p>
                {topics.map(({id, label, icon: Icon}, index) => (
                    <Button
                        key={id}
                        onClick={() => onTopicSelect(id)}
                        variant="ghost"
                        className="w-full justify-start gap-4 text-sidebar-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:translate-x-2 group relative overflow-hidden rounded-xl py-6 animate-slide-in-left"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both'
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/0 via-sidebar-accent/20 to-sidebar-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] transform"
                            style={{transition: 'transform 0.8s ease-out, opacity 0.3s ease-out'}}/>

                        <div
                            className="absolute inset-0 bg-sidebar-accent/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"/>

                        <div className="relative z-10 flex items-center gap-4 w-full">
                            <div
                                className="p-2 rounded-lg bg-sidebar-accent/10 group-hover:bg-sidebar-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110"/>
                            </div>
                            <span className="font-medium text-base">{label}</span>
                        </div>

                        <div
                            className="absolute right-3 w-1 h-8 bg-sidebar-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"/>
                    </Button>
                ))}
            </nav>

            <div className="relative z-10 px-5 border-t border-sidebar-border/30">
                <Button
                    onClick={onClearChat}
                    variant="outline"
                    className="w-full justify-start gap-4 bg-sidebar/50 backdrop-blur-sm border-sidebar-border/40 hover:border-sidebar-accent/70 hover:bg-sidebar-accent/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group rounded-xl py-5 relative"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                    <Trash2
                        className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"/>
                    <span className="relative z-10 font-medium">Clear Chat</span>
                </Button>
            </div>

            <div className="flex gap-4 justify-center p-5">
                {[
                    {icon: Github, label: "GitHub"},
                    {icon: Linkedin, label: "LinkedIn"},
                    {icon: Mail, label: "Email"}
                ].map(({icon: Icon, label}) => (
                    <Button
                        key={label}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 hover:bg-sidebar-accent/10 transition-colors duration-200 rounded-lg"
                    >
                        <Icon className="h-4 w-4"/>
                        <span className="sr-only">{label}</span>
                    </Button>
                ))}
            </div>
        </aside>
    )
}