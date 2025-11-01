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
                className="group w-full justify-start gap-4 rounded-xl py-5 relative overflow-hidden transition-all duration-300 bg-sidebar/50 backdrop-blur-sm border-sidebar-border/40 hover:bg-sidebar-accent/20 active:bg-sidebar-accent/20 hover:shadow-lg active:shadow-lg hover:scale-[1.02] active:scale-[1.02]"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-indigo-500/20 to-red-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100"
                />
                <Trash2
                    className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 group-active:scale-110 group-active:rotate-12"
                />
                <span className="relative z-10 font-medium">Clear Chat</span>
            </Button>
        </div>
    )
}
