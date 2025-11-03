"use client"

import {useRef, useEffect, useState} from "react"
import {motion} from "framer-motion"

interface DigitalRainProps {
    onComplete: () => void;
}

export function DigitalRain({onComplete}: DigitalRainProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        const columns = Math.floor(width / 20)
        const drops = Array.from({length: columns}).map(() => Math.floor(Math.random() * height))

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)"
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = "#0f0"
            ctx.font = "15px monospace"

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(Math.random() * 128)
                ctx.fillText(text, i * 20, drops[i] * 20)

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 33)

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener("resize", handleResize)

        // Set timeout to fade out
        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false)
        }, 5000); // Start fading out after 5 seconds

        // Set timeout to call onComplete after fade out is finished
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 7000); // Total duration of 7 seconds

        return () => {
            clearInterval(interval)
            window.removeEventListener("resize", handleResize)
            clearTimeout(fadeOutTimer)
            clearTimeout(completeTimer)
        }
    }, [onComplete])

    return (
        <motion.div 
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{opacity: 0}}
            animate={{opacity: isVisible ? 1 : 0}}
            transition={{duration: 2}}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.h1 
                    className="text-4xl md:text-6xl font-mono text-green-400/80 text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 2, duration: 2}}
                >
                    Welcome to the Real World.
                </motion.h1>
            </div>
        </motion.div>
    )
}
