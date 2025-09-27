import {motion} from "framer-motion";
import {useState, useEffect} from "react";
import {NavLogo} from "./NavLogo";
import {NavMenu} from "./NavMenu";
import {NavActions} from "./NavActions";
import {MobileNavOverlay} from "./MobileNavOverlay.tsx";

interface NavigationProps {
    onChatToggle?: () => void;
}

export function Navigation({onChatToggle}: NavigationProps) {
    const [activeSection, setActiveSection] = useState<string>("hero");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
            setIsMobileMenuOpen(false); // Close mobile menu after navigation
        }
    };

    // Scroll-based navigation highlighting
    useEffect(() => {
        const sections = ["hero", "about", "projects", "skills", "contact"];
        const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -70% 0px",
                threshold: 0.1
            }
        );

        sectionElements.forEach((element) => {
            if (element) observer.observe(element);
        });

        return () => {
            sectionElements.forEach((element) => {
                if (element) observer.unobserve(element);
            });
        };
    }, []);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-18 py-2">
                        <NavLogo/>

                        <NavMenu
                            activeSection={activeSection}
                            onSectionClick={scrollToSection}
                            isMobile={false}
                        />

                        <NavActions
                            onChatToggle={onChatToggle}
                            isMobileMenuOpen={isMobileMenuOpen}
                            onMobileMenuToggle={handleMobileMenuToggle}
                        />
                    </div>
                </div>
            </motion.nav>

            <MobileNavOverlay
                isOpen={isMobileMenuOpen}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
                onClose={handleMobileMenuClose}
            />
        </>
    );
}