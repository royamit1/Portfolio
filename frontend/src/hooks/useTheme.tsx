// useTheme.tsx
import {createContext, useContext, useEffect, useState} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
    toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// ✅ Get and apply theme IMMEDIATELY before React renders
function getInitialTheme(storageKey: string, defaultTheme: Theme): Theme {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey) as Theme;
        const theme = stored || defaultTheme;

        // Apply theme class immediately to prevent flash
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches ? "dark" : "light";
            root.classList.add(systemTheme);
            return "system";
        } else {
            root.classList.add(theme);
            return theme;
        }
    }
    return defaultTheme;
}

export function ThemeProvider({
                                  children,
                                  defaultTheme = "dark", // ✅ Default to dark
                                  storageKey = "portfolio-theme",
                                  ...props
                              }: ThemeProviderProps) {
    // ✅ Theme is applied during initialization
    const [theme, setTheme] = useState<Theme>(() =>
        getInitialTheme(storageKey, defaultTheme)
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        toggleTheme: () => {
            const newTheme = theme === "dark" ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};