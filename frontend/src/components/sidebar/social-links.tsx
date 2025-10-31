"use client"

import {useState} from "react"
import {toast} from "sonner"
import {Button} from "@/components/ui/button"
import {FaGithub, FaLinkedin, FaEnvelope} from "react-icons/fa"
import type {IconType} from "react-icons"
import {ContactForm, type ContactFormData} from "@/components/sidebar/contact-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

interface SocialItem {
    icon: IconType
    label: string
    url?: string
    action?: "contact"
}

const SOCIAL_ITEMS: SocialItem[] = [
    {icon: FaGithub, label: "GitHub", url: "https://github.com/royamit1"},
    {icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/royamit1/"},
    {icon: FaEnvelope, label: "Email", action: "contact"}
]

export function SocialLinks() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleClick = (item: SocialItem) => {
        if (item.action === "contact") {
            setIsModalOpen(true)
        } else if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer")
        }
    }

    const handleSubmit = async (data: ContactFormData) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to send message")

            toast.success("Message sent successfully! ✅")
            setIsModalOpen(false)
        } catch (error) {
            toast.error("Failed to send message. Please try again. ❌")
            console.error(error)
        }
    }

    return (
        <>
            {/* Buttons */}
            <div className="flex gap-4 justify-center p-5">
                {SOCIAL_ITEMS.map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        className="group h-10 w-12 rounded-lg hover:text-indigo-400 active:text-indigo-400 hover:scale-[1.12] active:scale-[1.12] hover:shadow-lg active:shadow-lg transition-all duration-300"
                        onClick={() => handleClick(item)}
                        aria-label={item.label}
                    >
                        <item.icon className="h-4 w-4"/>
                        <span className="sr-only">{item.label}</span>
                    </Button>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    className="max-w-2xl w-full p-0 border-none bg-transparent shadow-none
                     animate-in fade-in-0 zoom-in-95 duration-200
                     data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Contact Form</DialogTitle>
                        <DialogDescription>
                            Send me a message and I'll get back to you soon.
                        </DialogDescription>
                    </DialogHeader>

                    <ContactForm onSubmit={handleSubmit}/>
                </DialogContent>
            </Dialog>
        </>
    )
}
