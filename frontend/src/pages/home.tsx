import { useState } from "react";
import { Navigation } from "@/components/navigation/Navigation.tsx";
// import { HeroSection } from "@/components/hero-section";
// import { AboutSection } from "@/components/about-section";
// import { ProjectsSection } from "@/components/projects-section";
// import { SkillsSection } from "@/components/skills-section";
// import { ContactSection } from "@/components/contact-section";
// import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            <Navigation onChatToggle={toggleChat} />
            {/*<HeroSection onChatToggle={toggleChat} />*/}
            {/*<AboutSection />*/}
            {/*<ProjectsSection />*/}
            {/*<SkillsSection />*/}
            {/*<ContactSection />*/}
            {/*<ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />*/}

            {/* Footer */}
            <footer className="bg-secondary/50 border-t border-border py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4" data-testid="footer-copyright">
                            © 2024 Alex Chen. Built with React, FastAPI, and lots of coffee ☕
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid="footer-description">
                            This portfolio showcases AI-powered web development and modern tech stack integration.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
