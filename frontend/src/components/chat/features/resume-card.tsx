"use client"

import {ArrowDownToLine} from "lucide-react"

export default function ResumeCard() {
    return (
        <div
            className="relative w-full max-w-md mx-auto text-center rounded-3xl p-8 shadow-xl
                 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800"
        >
            <h3 className="text-lg font-semibold mb-2">Download My Resume</h3>
            <p className="text-sm text-muted-foreground mb-6">
                A concise overview of my experience, projects, and technical expertise.
            </p>

            <a
                href="/Ofir-Resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gray-800 text-white
      hover:bg-gray-700 transition-all duration-300 text-sm font-medium"
            >
                <ArrowDownToLine className="w-4 h-4"/>
                Download PDF
            </a>
        </div>
    )
}
