"use client"

import { motion } from "framer-motion"
import { RLogo } from "@/components/ui/RLogo"

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
                {/* R Logo with circular background */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <RLogo size={160} />
                </motion.div>

                {/* Optional loading text */}
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
                                    key={`dot-${i}`}
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