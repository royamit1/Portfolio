"use client"
import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { markdownComponents } from "@/features/chat/lib/markdown-styles"

interface StreamingTextProps {
    text: string
    delay?: number
    speed?: number
    onComplete?: () => void
    className?: string
    instant?: boolean
}

export function StreamingText({
    text,
    delay = 0,
    speed = 10,
    onComplete,
    className = "",
    instant = false
}: StreamingTextProps) {
    const [displayedText, setDisplayedText] = useState(instant ? text : "")
    const [isComplete, setIsComplete] = useState(instant)

    // Keep a stable ref to the callback so we don't restart the effect when it changes
    const onCompleteRef = useRef(onComplete)
    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        if (instant) {
            setDisplayedText(text)
            setIsComplete(true)
            // Use timeout to ensure this runs after render, preventing update-during-render warnings if parent updates
            const t = setTimeout(() => onCompleteRef.current?.(), 0)
            return () => clearTimeout(t)
        }

        let isCancelled = false
        setDisplayedText("")
        setIsComplete(false)

        const run = async () => {
            if (delay > 0) {
                await new Promise(r => setTimeout(r, delay))
            }
            if (isCancelled) return

            for (let i = 0; i <= text.length; i++) {
                if (isCancelled) return;
                setDisplayedText(text.slice(0, i));

                // Add a slight variance to speed to make it feel more human/network-like
                const dynamicSpeed = speed + (Math.random() * 5);
                await new Promise(r => setTimeout(r, dynamicSpeed));
            }

            if (!isCancelled) {
                setIsComplete(true)
                onCompleteRef.current?.() // Call the latest onComplete from ref
            }
        }

        run()

        return () => { isCancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, delay, speed, instant])

    return (
        <span className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {displayedText}
            </ReactMarkdown>
        </span>
    )
}
