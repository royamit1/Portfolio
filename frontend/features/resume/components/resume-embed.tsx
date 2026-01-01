"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ResumeEmbed() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        // Simple check to detect mobile devices to avoid bad iframe UX
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-4"
        >
            <Card className={cn(
                "overflow-hidden flex flex-col rounded-2xl",
                "bg-zinc-900/95 border border-white/10 backdrop-blur-xl",
                "shadow-2xl shadow-black/50"
            )}>
                {/* --- Header / Toolbar --- */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm md:text-base">Roy Amit - Resume</h3>
                            <p className="text-xs text-zinc-400 hidden md:block">PDF Document • 2026</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white hover:bg-white/10 hidden md:flex"
                            asChild
                        >
                            <a href="/resume.pdf" download="RoyAmit_Resume.pdf">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-white/10"
                            asChild
                        >
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                                <span className="hidden md:inline">Open Fullscreen</span>
                                <span className="md:hidden">View PDF</span>
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* --- PDF Preview Area --- */}
                <div className="relative w-full bg-zinc-800/50 flex flex-col items-center justify-center">

                    {!isMobile ? (
                        // Desktop: Show actual PDF Embed
                        <iframe
                            src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                            className="w-full aspect-[1/1.42] border-none rounded-b-2xl"
                            title="Resume PDF"
                        />
                    ) : (
                        // Mobile: Show a nice placeholder instead of a broken iframe
                        <div className="text-center p-8 space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-zinc-500" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-zinc-300 font-medium">Preview not available on mobile</p>
                                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                                    Tap the button above to view the full PDF on your device.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}
