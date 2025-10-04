"use client"

import * as React from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"
import {Button} from "@/components/ui/button"

export function ThemeToggle() {
    const {theme, setTheme} = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled>
                <Sun className="h-4 w-4"/>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full transition-all hover:bg-sidebar-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-sidebar-foreground transition-transform hover:rotate-12"/>
            ) : (
                <Moon className="h-4 w-4 text-sidebar-foreground transition-transform hover:-rotate-12"/>
            )}
        </Button>
    )
}
