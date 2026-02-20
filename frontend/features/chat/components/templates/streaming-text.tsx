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
    onStream?: () => void
    className?: string
    instant?: boolean
}

export function StreamingText({
    text,
    delay = 0,
    speed = 10,
    onComplete,
    onStream,
    className = "",
    instant = false
}: StreamingTextProps) {
    const [displayedText, setDisplayedText] = useState(instant ? text : "")

    const onCompleteRef = useRef(onComplete)
    const onStreamRef = useRef(onStream)
    useEffect(() => {
        onCompleteRef.current = onComplete
        onStreamRef.current = onStream
    }, [onComplete, onStream])

    useEffect(() => {
        if (instant) {
            setDisplayedText(text)
            const t = setTimeout(() => onCompleteRef.current?.(), 0)
            return () => clearTimeout(t)
        }

        let isCancelled = false
        setDisplayedText("")

        const run = async () => {
            if (delay > 0) {
                await new Promise(r => setTimeout(r, delay))
            }
            if (isCancelled) return

            for (let i = 0; i <= text.length; i++) {
                if (isCancelled) return;
                setDisplayedText(text.slice(0, i));

                if (i % 5 === 0) onStreamRef.current?.()

                const dynamicSpeed = speed + (Math.random() * 5);
                await new Promise(r => setTimeout(r, dynamicSpeed));
            }

            if (!isCancelled) {
                onCompleteRef.current?.()
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
