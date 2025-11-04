import {useState, useEffect, useRef} from "react"

interface UseTypewriterOptions {
    delay?: number // Delay between each character in milliseconds
    onTypingEnd?: () => void // Callback when typing animation finishes
}

export function useTypewriter(text: string, options?: UseTypewriterOptions) {
    const {delay = 10, onTypingEnd} = options || {}
    const [typedText, setTypedText] = useState("")
    const [isTyping, setIsTyping] = useState(true)
    const onTypingEndRef = useRef(onTypingEnd)

    // Keep the callback ref updated without re-triggering the effect
    useEffect(() => {
        onTypingEndRef.current = onTypingEnd
    }, [onTypingEnd])

    useEffect(() => {
        if (!text) {
            setTypedText("")
            setIsTyping(false)
            return
        }

        setTypedText("")
        setIsTyping(true)

        let i = 0
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                // Use substring to avoid issues with stale state in setInterval closure
                setTypedText(text.substring(0, i + 1))
                i++
            } else {
                clearInterval(typingInterval)
                setIsTyping(false)
                onTypingEndRef.current?.()
            }
        }, delay)

        return () => clearInterval(typingInterval)
    }, [text, delay])

    return {typedText, isTyping}
}
