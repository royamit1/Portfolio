// "use client"
//
// import {useState} from "react"
// import {Sidebar} from "@/components/sidebar"
// import {ChatWindow} from "@/components/chat-window.tsx"
// import {GreetingBanner} from "@/components/greeting-banner.tsx"
// import {useChat} from "@/hooks/useChat"
// import type {Topic} from "@/lib/types"
//
// export function ChatLayout() {
//     const {messages, isTyping, sendMessage, setMessages} = useChat()
//     const [showBanner, setShowBanner] = useState(true)
//
//     const handleTopicSelect = async (topic: Topic) => {
//         setShowBanner(false)
//         const topicQuestions: Record<Topic, string> = {
//             projects: "Can you tell me about your projects?",
//             skills: "What skills do you have?",
//             resume: "Can you summarize your professional background?",
//         }
//         await sendMessage(topicQuestions[topic])
//     }
//
//     const handleSendMessage = async (content: string) => {
//         setShowBanner(false)
//         await sendMessage(content)
//     }
//
//     const handleClearChat = () => {
//         setMessages([])
//         setShowBanner(true)
//     }
//
//     return (
//         <div className="flex h-screen overflow-hidden bg-background">
//             <Sidebar onTopicSelect={handleTopicSelect} onClearChat={handleClearChat}/>
//
//             <main className="flex flex-1 flex-col overflow-hidden">
//                 <ChatWindow
//                     messages={messages}
//                     isTyping={isTyping}
//                     showBanner={showBanner}
//                     banner={<GreetingBanner onTopicSelect={handleTopicSelect}/>}
//                     onSendMessage={handleSendMessage}
//                 />
//             </main>
//         </div>
//     )
// }
//
//


"use client"

import {useState} from "react"
import {Sidebar} from "@/components/sidebar/sidebar.tsx"
import {ChatWindow} from "@/components/chat/chat-window.tsx"
import {GreetingBanner} from "@/components/chat/greeting-banner.tsx"
import type {Message, Topic} from "@/lib/types.ts"

export function ChatLayout() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [showBanner, setShowBanner] = useState(true)

    const handleTopicSelect = async (topic: Topic) => {
        setShowBanner(false)
        setIsTyping(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const responses: Record<Topic, string> = {
            projects:
                "Here's an overview of my projects! I've worked on various full-stack applications, from AI-powered chatbots to e-commerce platforms. Each project showcases my ability to blend thoughtful design with robust engineering. Would you like to explore a specific project?",
            skills:
                "Let me highlight my technical skills! I specialize in React, TypeScript, Next.js, and Python. I'm passionate about creating accessible, pixel-perfect user interfaces and building scalable backend systems. I also have experience with FastAPI, PostgreSQL, and modern AI integrations.",
            resume:
                "Here's a summary of my professional background! I'm a full-stack developer with 5+ years of experience building web applications. I've worked with startups and established companies, leading projects from conception to deployment. My focus is on creating exceptional user experiences backed by solid engineering principles.",
        }

        const botMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: responses[topic],
            timestamp: new Date(),
            showProjectCards: topic === "projects",
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
    }

    const handleSendMessage = async (content: string) => {
        setShowBanner(false)

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simple response logic (in production, this would call your FastAPI backend)
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
                "That's a great question! In a production environment, I'd be connected to a FastAPI backend with OpenAI integration and pgvector for semantic search. For now, I'm here to help you explore my portfolio. Feel free to ask about my projects, skills, or experience!",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
    }

    const handleClearChat = () => {
        setMessages([])
        setShowBanner(true)
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar onTopicSelect={handleTopicSelect} onClearChat={handleClearChat}/>

            <main className="flex flex-1 flex-col overflow-hidden">
                <ChatWindow
                    messages={messages}
                    isTyping={isTyping}
                    showBanner={showBanner}
                    banner={<GreetingBanner onTopicSelect={handleTopicSelect}/>}
                    onSendMessage={handleSendMessage}
                />
            </main>
        </div>
    )
}