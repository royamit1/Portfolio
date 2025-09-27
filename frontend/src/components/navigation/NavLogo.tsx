import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";

export function NavLogo() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Logo Icon */}
            <div className="relative">
                <motion.div
                    className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10"
                    whileHover={{ 
                        boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)",
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{ duration: 0.6 }}
                >
                    <Code2 className="w-6 h-6 text-white" />
                    
                    {/* Sparkle effect */}
                    <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                    </motion.div>
                </motion.div>
                
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                    initial={false}
                />
            </div>

            {/* Logo Text */}
            <div className="hidden sm:block">
                <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Roy Amit
                    </span>
                    <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
                <motion.div 
                    className="text-sm text-muted-foreground -mt-1 font-medium"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Full Stack Developer
                </motion.div>
            </div>
        </motion.div>
    );
}