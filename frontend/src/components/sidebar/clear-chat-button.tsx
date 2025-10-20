import {Button} from "@/components/ui/button"
import {Trash2} from "lucide-react"

interface ClearChatButtonProps {
    onClearChat: () => void
}

export function ClearChatButton({onClearChat}: ClearChatButtonProps) {
    return (
        <div className="relative z-10 px-5">
            <Button
                onClick={onClearChat}
                variant="outline"
                className="w-full justify-start gap-4 bg-sidebar/50 backdrop-blur-sm border-sidebar-border/40 hover:border-sidebar-accent/70 hover:bg-sidebar-accent/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group rounded-xl py-5 relative"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-indigo-500/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                <Trash2
                    className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"/>
                <span className="relative z-10 font-medium">Clear Chat</span>
            </Button>
        </div>
    )
}