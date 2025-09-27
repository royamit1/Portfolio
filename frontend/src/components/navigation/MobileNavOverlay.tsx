import {motion, AnimatePresence} from "framer-motion";
import {NavMenu} from "./NavMenu";

interface MobileNavOverlayProps {
    isOpen: boolean;
    activeSection: string;
    onSectionClick: (sectionId: string) => void;
    onClose: () => void;
}

export function MobileNavOverlay({
                                     isOpen,
                                     activeSection,
                                     onSectionClick,
                                     onClose
                                 }: MobileNavOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Mobile Menu Overlay */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 25 }}
                        className="fixed top-18 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-xl md:hidden"
                    >
                        <NavMenu
                            activeSection={activeSection}
                            onSectionClick={onSectionClick}
                            isMobile={true}
                        />
                    </motion.div>

                    {/* Mobile Menu Backdrop */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />
                </>
            )}
        </AnimatePresence>
    );
}