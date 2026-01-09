//
"use client"

import {useState, useCallback, useRef} from "react"
import {useChatContext} from "@/features/chat/context/chat-context"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useTour() {
    const {
        setMessages, setInputText, setIsSidebarOpen,
        onTopicSelect, scrollToBottom, setTourStep
    } = useChatContext()

    const [isTourActive, setIsTourActive] = useState(false)
    const abortRef = useRef(false)

    // Ghost Typer Helper
    const typeToInput = useCallback(async (text: string) => {
        for (let i = 0; i <= text.length; i++) {
            if (abortRef.current) return
            setInputText(text.slice(0, i))
            await wait(50 + Math.random() * 30)
        }
    }, [setInputText])

    const startTour = useCallback(async () => {
        if (isTourActive) return
        setIsTourActive(true)
        abortRef.current = false

        try {
            // --- STEP 1: Center Intro ---
            setTourStep({
                targetId: "intro-center",
                placement: "center",
                message: "Hello! I'm Roy's AI agent. Let me give you a quick guided tour."
            })
            await wait(3000)
            if (abortRef.current) return

            // --- STEP 3: Open Sidebar ---
            setIsSidebarOpen(true)
            await wait(800)

            // --- STEP 4: EMPHASIZE WHOLE SIDEBAR ---
            setTourStep({
                targetId: "sidebar-wrapper",
                placement: "right",
                message: "This is the navigation sidebar. It stays with you throughout the conversation."
            })
            await wait(4000)
            if (abortRef.current) return

            // --- STEP 5: Highlight Projects (Inner Component) ---
            const topicMessage = "Use these buttons to visually explore my Projects, Skills, and Resume.";

            // 4a. Projects
            setTourStep({
                targetId: "tour-topic-projects",
                popupAnchorId: "tour-topic-projects",
                placement: "right",
                message: topicMessage
            })
            await wait(2000)
            if (abortRef.current) return

            // 4b. Skills
            setTourStep({
                targetId: "tour-topic-skills",
                popupAnchorId: "tour-topic-projects", // Anchor to first button to keep popup steady
                placement: "right",
                message: topicMessage
            })
            await wait(2000)
            if (abortRef.current) return

            // 4c. Resume
            setTourStep({
                targetId: "tour-topic-resume",
                popupAnchorId: "tour-topic-projects",
                placement: "right",
                message: topicMessage
            })
            await wait(2000) // Slightly longer pause at the end of the group
            if (abortRef.current) return

            // --- STEP 5: Highlight Socials (MOVED DOWN & HOISTED) ---
            setTourStep({
                targetId: "tour-social-links", // The GLOW stays on the social links
                popupAnchorId: "tour-clear-chat", // The POPUP sits next to the Clear Chat button (Higher up)
                placement: "right",
                message: "You can find my LinkedIn, GitHub, and direct contact details here."
            })
            await wait(4500)
            if (abortRef.current) return

            // --- STEP 6: Close Sidebar ---
            // setTourStep(null)
            setIsSidebarOpen(false)
            // await wait(800)
            // if (abortRef.current) return

            // --- STEP 7: Input Area ---
            scrollToBottom("smooth")
            setTourStep({
                targetId: "chat-input-area",
                placement: "top",
                message: "You can also drive the experience by typing commands. Watch this..."
            })
            await wait(3500)
            setTourStep(null)

            // --- STEP 8: Typing Simulation ---
            setTourStep({
                targetId: "chat-input-area",
                placement: "top",
                message: "Typing '/resume'..."
            })
            await typeToInput("/resume")
            await wait(500)

            setTourStep(null)
            setInputText("")
            onTopicSelect("resume")

            // --- STEP 9: Finish ---
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: "Here is my Resume. Feel free to explore!",
                timestamp: new Date()
            }])
            scrollToBottom("smooth")

        } catch (error) {
            console.error("Tour interrupted", error)
        } finally {
            setIsTourActive(false)
            setTourStep(null)
            abortRef.current = false
            setInputText("")
        }
    }, [isTourActive, typeToInput, setIsSidebarOpen, setInputText, onTopicSelect, scrollToBottom, setTourStep, setMessages])

    const cancelTour = useCallback(() => {
        abortRef.current = true
        setIsTourActive(false)
        setTourStep(null)
        setInputText("")
        setIsSidebarOpen(false)
    }, [setInputText, setIsSidebarOpen, setTourStep])

    return {startTour, cancelTour, isTourActive}
}