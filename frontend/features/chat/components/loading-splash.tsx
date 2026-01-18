"use client"

import { motion } from "framer-motion"

interface LoadingSplashProps {
    showText?: boolean
}

export function LoadingSplash({ showText = false }: LoadingSplashProps) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Animated background grid */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(165,180,252,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Dynamically Written R Letter */}
                <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <svg viewBox="0 0 100 120" className="w-32 h-auto">
                        <defs>
                            <linearGradient id="rGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>

                            {/* Glow filter for writing effect */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* R Letter - All strokes drawn simultaneously */}
                        <g filter="url(#glow)">
                            {/* Vertical stem */}
                            <motion.path
                                d="M 30 20 L 30 100"
                                stroke="url(#rGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.3,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Top curve/bowl */}
                            <motion.path
                                d="M 30 20 L 55 20 Q 70 20 70 35 Q 70 50 55 50 L 30 50"
                                stroke="url(#rGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.3,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Diagonal leg */}
                            <motion.path
                                d="M 55 50 L 75 100"
                                stroke="url(#rGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.3,
                                    ease: "easeInOut"
                                }}
                            />
                        </g>
                    </svg>
                </motion.div>

                {/* Loading text */}
                {showText && (
                    <motion.div
                        className="text-center space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Restoring Conversation
                        </h2>
                        <div className="flex items-center justify-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-indigo-400 rounded-full"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
