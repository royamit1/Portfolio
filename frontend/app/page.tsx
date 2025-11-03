'use client';

import {useState} from 'react';
import {toast} from 'sonner';
import {ChatLayout} from '@/app/components/chat/chat-layout';
import type {Message, Topic} from '@/app/lib/types';
import type {ContactFormData} from '@/app/components/sidebar/contact-dialog';

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    const handleTopicSelect = async (topic: Topic) => {
        setShowBanner(false);
        setIsTyping(true);
        setIsSidebarOpen(false);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: `Tell me about your ${topic}.`,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const responses: Record<Topic, string> = {
            projects:
                "Of course! Here are some of the projects I'm most proud of. Each one showcases a different aspect of my full-stack development skills.",
            skills:
                "Let me highlight my technical skills! I specialize in creating pixel-perfect user interfaces and building scalable backend systems.",
            resume:
                'Here is a summary of my professional background. You can also download the full PDF.',
        };

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responses[topic],
            timestamp: new Date(),
            showProjectCards: topic === 'projects',
            showSkillsGrid: topic === 'skills',
            showResume: topic === 'resume',
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
    };

    const handleSendMessage = async (content: string) => {
        setShowBanner(false);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        // Command handling
        const command = content.trim().toLowerCase();
        if (command.startsWith('/')) {
            let botMessage: Message | null = null;
            switch (command) {
                case '/projects':
                    botMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: 'Of course! Here are some of my featured projects.',
                        timestamp: new Date(),
                        showProjectCards: true,
                    };
                    break;
                case '/skills':
                    botMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: 'Here is a breakdown of my technical skills.',
                        timestamp: new Date(),
                        showSkillsGrid: true,
                    };
                    break;
                case '/resume':
                    botMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: 'Here you go! You can download the full PDF as well.',
                        timestamp: new Date(),
                        showResume: true,
                    };
                    break;
                case '/contact':
                    setIsContactDialogOpen(true);
                    botMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: 'Opening the contact form for you.',
                        timestamp: new Date(),
                    };
                    break;
            }

            if (botMessage) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
                return;
            }
        }

        // Default response logic
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const defaultBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
                "That's a great question! In a production environment, I'd be connected to a FastAPI backend with OpenAI integration. For now, feel free to explore using the commands or sidebar.",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, defaultBotMessage]);
        setIsTyping(false);
    };

    const handleClearChat = () => {
        setMessages([]);
        setShowBanner(true);
        setIsSidebarOpen(false);
    };

    const handleContactSubmit = async (data: ContactFormData) => {
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Failed to send message. Please try again. ❌');
                console.error('Response not OK', response);
                return;
            }

            toast.success('Message sent successfully! ✅');
            setIsContactDialogOpen(false);
        } catch (error) {
            toast.error('Failed to send message. Please try again. ❌');
            console.error(error);
        }
    };

    return (
        <ChatLayout
            messages={messages}
            isTyping={isTyping}
            showBanner={showBanner}
            isSidebarOpen={isSidebarOpen}
            isContactDialogOpen={isContactDialogOpen}
            onTopicSelect={handleTopicSelect}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onContactSubmit={handleContactSubmit}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsContactDialogOpen={setIsContactDialogOpen}
        />
    );
}
