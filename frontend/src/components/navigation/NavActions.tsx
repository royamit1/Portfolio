import {useTheme} from "@/hooks/use-theme";
import {Button} from "@/components/ui/button";
import {Moon, Sun, Menu, X} from "lucide-react";

interface NavActionsProps {
    onChatToggle?: () => void;
    isMobileMenuOpen: boolean;
    onMobileMenuToggle: () => void;
}

export function NavActions({
                               onChatToggle,
                               isMobileMenuOpen,
                               onMobileMenuToggle
                           }: NavActionsProps) {
    const {theme, toggleTheme} = useTheme();

    return (
        <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl bg-secondary hover:bg-accent w-10 h-10"
                data-testid="theme-toggle"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === "dark" ? (
                    <Sun className="h-4 w-4"/>
                ) : (
                    <Moon className="h-4 w-4"/>
                )}
            </Button>

            {/* Chat Toggle (if provided) */}
            {onChatToggle && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onChatToggle}
                    className="rounded-xl bg-secondary hover:bg-accent w-10 h-10"
                    data-testid="chat-trigger"
                    aria-label="Toggle AI chat"
                >
                    <span className="text-lg" role="img" aria-label="robot">🤖</span>
                </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuToggle}
                className="md:hidden rounded-xl bg-secondary hover:bg-accent w-10 h-10"
                data-testid="mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
                {isMobileMenuOpen ? (
                    <X className="h-4 w-4"/>
                ) : (
                    <Menu className="h-4 w-4"/>
                )}
            </Button>
        </div>
    );
}