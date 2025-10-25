import {ChatLayout} from "@/components/chat/chat-layout.tsx";
import { Toaster } from "sonner"

function App() {

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <ChatLayout/>

            <Toaster
                position="top-right"
                richColors
                expand
            />
        </div>
    )
}

export default App