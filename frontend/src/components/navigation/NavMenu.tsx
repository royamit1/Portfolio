import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface NavMenuProps {
    activeSection: string;
    onSectionClick: (sectionId: string) => void;
    isMobile?: boolean;
}

import { navigationItems } from "./navigationItems";

export function NavMenu({ activeSection, onSectionClick, isMobile = false }: NavMenuProps) {
    const [markerStyle, setMarkerStyle] = useState({ left: 0, width: 0 });
    const navRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Update marker position when active section changes
    useEffect(() => {
        if (!isMobile && activeSection && itemRefs.current[activeSection]) {
            const activeElement = itemRefs.current[activeSection];
            const navElement = navRef.current;
            
            if (activeElement && navElement) {
                const navRect = navElement.getBoundingClientRect();
                const activeRect = activeElement.getBoundingClientRect();
                
                setMarkerStyle({
                    left: activeRect.left - navRect.left,
                    width: activeRect.width
                });
            }
        }
    }, [activeSection, isMobile]);

    const getNavItemClasses = (sectionId: string) => {
        const baseClasses = "relative px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ease-out";
        const isActive = activeSection === sectionId;
        const mobileClasses = isMobile ? "w-full text-left" : "";

        return `${baseClasses} ${mobileClasses} ${
            isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        }`;
    };

    const containerClasses = isMobile
        ? "px-4 py-4 space-y-2"
        : "hidden md:flex items-center relative bg-secondary/30 backdrop-blur-sm rounded-full px-2 py-2 border border-border/50";

    return (
        <div className={containerClasses} ref={navRef}>
            {/* Animated background marker for desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute bg-background border border-border/50 rounded-lg shadow-lg shadow-black/5"
                    style={{
                        left: markerStyle.left,
                        width: markerStyle.width,
                        height: '40px',
                        top: '4px',
                        zIndex: 0
                    }}
                    initial={false}
                    animate={{
                        left: markerStyle.left,
                        width: markerStyle.width
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8
                    }}
                />
            )}

            {navigationItems.map((item, index) => (
                <motion.button
                    key={item.id}
                    ref={(el) => {
                        itemRefs.current[item.id] = el;
                    }}
                    onClick={() => onSectionClick(item.id)}
                    className={getNavItemClasses(item.id)}
                    data-testid={isMobile ? `mobile-nav-${item.id}` : `nav-${item.id}`}
                    style={{ zIndex: 1 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        delay: isMobile ? 0 : index * 0.1,
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                    whileHover={!isMobile ? { 
                        y: -1,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                    } : {}}
                    whileTap={{ scale: 0.98 }}
                >
                    {item.label}
                    
                    {/* Mobile active indicator */}
                    {isMobile && activeSection === item.id && (
                        <motion.div
                            layoutId="mobile-nav-indicator"
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
