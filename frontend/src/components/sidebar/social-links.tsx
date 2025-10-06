import {Button} from "@/components/ui/button"
import {Github, Linkedin, Mail} from "lucide-react"

const SOCIAL_LINKS = [
    {icon: Github, label: "GitHub", url: "https://github.com/royamit1"},
    {icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/royamit1/"},
    {icon: Mail, label: "Email", url: "mailto:your-email@example.com"},
] as const

export function SocialLinks() {
    const handleClick = (url: string, label: string) => {
        if (label === "Email") {
            window.location.href = url
        } else {
            window.open(url, "_blank")
        }
    }

    return (
        <div className="flex gap-4 justify-center p-5">
            {SOCIAL_LINKS.map(({icon: Icon, label, url}) => (
                <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    className="group h-10 w-10 rounded-lg transition-colors duration-200 hover:bg-sidebar-accent/20"
                    onClick={() => handleClick(url, label)}
                >
                    <Icon className="h-4 w-4"/>
                    <span className="sr-only">{label}</span>
                </Button>
            ))}
        </div>
    )
}