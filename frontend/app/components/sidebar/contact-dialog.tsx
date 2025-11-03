"use client"

import React, {useState} from "react"
import {motion} from "framer-motion"
import {Button} from "@/app/components/ui/button"
import {DialogClose} from "@/app/components/ui/dialog"
import {Mail, User, MessageSquare, Send, X} from "lucide-react"

interface ContactFormProps {
    onSubmit?: (data: ContactFormData) => void
}

export interface ContactFormData {
    name: string
    email: string
    message: string
}

export function ContactForm({onSubmit}: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Partial<ContactFormData>>({})

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactFormData> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email"
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required"
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        try {
            if (onSubmit) {
                onSubmit(formData)
            }
            // Form will close via parent component after successful submission
        } catch (error) {
            // Error handling is done in parent component
            console.error("Form submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
        // Clear error when user starts typing
        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({...prev, [name]: undefined}))
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.25, ease: "easeOut"}}
                className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-xl
                 p-4 md:p- max-w-2xl w-full border border-border"
            >

                <div className="text-center space-y-2 mb-6">
                    <h2 className="text-3xl font-bold text-foreground">Get In Touch</h2>
                    <p className="text-lg bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent font-semibold">
                        Interested in collaborating or discussing a role?
                    </p>
                    <p className="text-md text-muted-foreground">
                        Feel free to reach out — I’d be happy to connect.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <User className="w-4 h-4 text-muted-foreground"/>
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className={`w-full px-4 py-3 rounded-xl bg-background/50 border ${
                                errors.name ? "border-accent/50" : "border-input"
                            } text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200`}
                        />
                        {errors.name && (
                            <p className="text-xs text-accent/80 mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <Mail className="w-4 h-4 text-muted-foreground"/>
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className={`w-full px-4 py-3 rounded-xl bg-background/50 border ${
                                errors.email ? "border-accent/50" : "border-input"
                            } text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200`}
                        />
                        {errors.email && (
                            <p className="text-xs text-accent/80">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="message"
                            className="flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <MessageSquare className="w-4 h-4 text-muted-foreground"/>
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about an opportunity or collaboration you have in mind..."
                            rows={5}
                            className={`w-full px-4 py-3 rounded-xl bg-background/50 border ${
                                errors.message ? "border-accent/50" : "border-input"
                            } text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200`}
                        />
                        {errors.message && (
                            <p className="text-xs text-accent/80">{errors.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full gap-2 py-6 text-base font-semibold rounded-xl
                                   bg-gradient-to-r from-accent to-purple-500
                                   hover:from-accent/90 hover:to-purple-500/90
                                   transition-all duration-300 hover:scale-[1.02]
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>Sending...</>
                        ) : (
                            <>
                                <Send className="w-5 h-5"/>
                                Send Message
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground pt-4">
                    Usually replies within 24 hours
                </p>
            </motion.div>
        </div>
    )
}
