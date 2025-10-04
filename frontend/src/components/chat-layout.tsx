"use client"

import {useState} from "react"
import {Sidebar} from "@/components/sidebar"
import {ChatWindow} from "@/components/chat-window.tsx"
import {GreetingBanner} from "@/components/greeting-banner.tsx"
import {useChat} from "@/hooks/useChat"
import type {Topic} from "@/lib/types"

export function ChatLayout() {
    const {messages, isTyping, sendMessage, setMessages} = useChat()
    const [showBanner, setShowBanner] = useState(true)

    const handleTopicSelect = async (topic: Topic) => {
        setShowBanner(false)
        const topicQuestions: Record<Topic, string> = {
            projects: "Can you tell me about your projects?",
            skills: "What skills do you have?",
            resume: "Can you summarize your professional background?",
        }
        await sendMessage(topicQuestions[topic])
    }

    const handleSendMessage = async (content: string) => {
        setShowBanner(false)
        await sendMessage(content)
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