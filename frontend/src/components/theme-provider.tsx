"use client"

import {Sun, Moon, Laptop} from "lucide-react"
import {useTheme} from "@/hooks/useTheme.tsx"
import {useEffect, useState} from "react"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group"

const ThemeProvider = () => {
    const [mounted, setMounted] = useState(false)
    const {theme, setTheme} = useTheme()

    // Ensure the component is mounted before showing UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const ICON_SIZE = 18

    return (
        <div className="flex justify-start">
            <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => {
                    if (value) setTheme(value as "light" | "dark" | "system")
                }}
                className="gap-1"
                aria-label="Theme Switcher"
            >
                <ToggleGroupItem
                    value="light"
                    aria-label="Light Theme"
                    className="rounded-lg px-3 py-2 hover:bg-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                    <Sun size={ICON_SIZE}/>
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="dark"
                    aria-label="Dark Theme"
                    className="rounded-lg px-3 py-2 hover:bg-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                    <Moon size={ICON_SIZE}/>
                </ToggleGroupItem>

                <ToggleGroupItem
                    value="system"
                    aria-label="System Theme"
                    className="rounded-lg px-3 py-2 hover:bg-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                    <Laptop size={ICON_SIZE}/>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

export {ThemeProvider}