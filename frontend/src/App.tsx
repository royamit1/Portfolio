import {useState} from "react";
import Projects from "./components/projects/Projects.tsx";
import {Navigation} from "./components/navigation/Navigation.tsx";
import './App.css'

function App() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navigation onChatToggle={toggleChat}/>
            <Projects/>
        </div>
    )
}

export default App