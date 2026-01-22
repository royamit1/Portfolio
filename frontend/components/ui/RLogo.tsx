import { motion } from "framer-motion";

export function RLogo({ size = 120, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer pulsing ring */}
            <motion.circle
                cx="100"
                cy="100"
                r="90"
                stroke="url(#circleGradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [0.8, 1, 0.8],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ transformOrigin: "center" }}
            />

            {/* Middle background circle - dark black */}
            <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="#0a0a0a"
                opacity="0.6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 0.6
                }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut"
                }}
                style={{ transformOrigin: "center" }}
            />

            {/* Inner rotating circle */}
            <motion.circle
                cx="100"
                cy="100"
                r="75"
                stroke="url(#circleGradient)"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
                opacity="0.15"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{
                    rotate: 360,
                    opacity: 0.15
                }}
                transition={{
                    rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    },
                    opacity: {
                        duration: 1,
                        ease: "easeOut"
                    }
                }}
                style={{ transformOrigin: "center" }}
            />

            {/* Gradient definition - darker tones */}
            <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
            </defs>

            {/* Stylized R letter with drawing animation */}
            <motion.path
                d="M 70 60 L 70 140 M 70 60 L 105 60 C 120 60 130 70 130 85 C 130 100 120 110 105 110 L 70 110 M 100 110 L 130 140"
                stroke="url(#letterGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                }}
            />
        </svg>
    );
}