"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, User, MessageSquare, Send, Loader2, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ContactFormData {
    name: string
    email: string
    message: string
}

interface ContactFormProps {
    onSubmit?: (data: ContactFormData) => Promise<void> | void
    onClose?: () => void
}

export function ContactForm({ onSubmit, onClose }: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState<Partial<ContactFormData>>({})
    const [focusedField, setFocusedField] = useState<keyof ContactFormData | null>(null)

    // Validation constants matching server-side rules
    const VALIDATION = {
        NAME_MIN: 2,
        NAME_MAX: 100,
        MESSAGE_MIN: 10,
        MESSAGE_MAX: 500,
        // RFC 5322 compliant email regex (stricter than basic check)
        EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
        // Name: only letters, spaces, hyphens, apostrophes (no numbers or special chars)
        NAME_REGEX: /^[a-zA-Z\u0590-\u05FF\u0400-\u04FF\s\-']+$/,
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactFormData> = {}

        const trimmedName = formData.name.trim()
        const trimmedEmail = formData.email.trim().toLowerCase()
        const trimmedMessage = formData.message.trim()

        if (!trimmedName) {
            newErrors.name = "Name is required"
        } else if (trimmedName.length < VALIDATION.NAME_MIN) {
            newErrors.name = `Name must be at least ${VALIDATION.NAME_MIN} characters`
        } else if (trimmedName.length > VALIDATION.NAME_MAX) {
            newErrors.name = `Name must be less than ${VALIDATION.NAME_MAX} characters`
        } else if (!VALIDATION.NAME_REGEX.test(trimmedName)) {
            newErrors.name = "Name can only contain letters, spaces, and hyphens"
        }

        if (!trimmedEmail) {
            newErrors.email = "Email is required"
        } else if (!VALIDATION.EMAIL_REGEX.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!trimmedMessage) {
            newErrors.message = "Message is required"
        } else if (trimmedMessage.length < VALIDATION.MESSAGE_MIN) {
            newErrors.message = `Message must be at least ${VALIDATION.MESSAGE_MIN} characters`
        } else if (trimmedMessage.length > VALIDATION.MESSAGE_MAX) {
            newErrors.message = `Message must be less than ${VALIDATION.MESSAGE_MAX} characters`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            if (onSubmit) {
                await onSubmit(formData)
            }
            // Only set success if we got here without errors
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Form submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 mx-auto max-w-[calc(100%-2rem)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-lg bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden"
            >
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                )}

                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    <div className="text-center space-y-1 sm:space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Get in Touch</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                            I'd love to hear from you. Send me a message and I'll get back to you soon.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div className="space-y-1.5">
                            <div className={cn(
                                "relative flex items-center transition-all duration-300 rounded-xl border",
                                focusedField === 'name'
                                    ? "border-white/20 bg-black/30"
                                    : errors.name
                                        ? "border-red-500/50 bg-black/20"
                                        : "border-white/5 bg-black/20 hover:border-white/10"
                            )}>
                                <User className={cn("w-4 h-4 ml-3 transition-colors flex-shrink-0", focusedField === 'name' ? "text-zinc-300" : "text-zinc-500")} />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    maxLength={100}
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={(e) => {
                                        setFocusedField('name');
                                        setTimeout(() => e.target.select(), 0);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Name"
                                    className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 px-3 py-2.5 sm:py-3 rounded-xl autofill:bg-black/30 autofill:text-zinc-100 [-webkit-autofill&]:bg-black/30 [-webkit-autofill&]:text-zinc-100 [-webkit-autofill&]:[-webkit-text-fill-color:rgb(244_244_245)] [-webkit-autofill&]:[-webkit-box-shadow:0_0_0px_1000px_rgba(0,0,0,0.3)_inset]"
                                />
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] text-red-400 ml-1"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-1.5">
                            <div className={cn(
                                "relative flex items-center transition-all duration-300 rounded-xl border",
                                focusedField === 'email'
                                    ? "border-white/20 bg-black/30"
                                    : errors.email
                                        ? "border-red-500/50 bg-black/20"
                                        : "border-white/5 bg-black/20 hover:border-white/10"
                            )}>
                                <Mail className={cn("w-4 h-4 ml-3 transition-colors flex-shrink-0", focusedField === 'email' ? "text-zinc-300" : "text-zinc-500")} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={(e) => {
                                        setFocusedField('email');
                                        // Select all text on focus (for autofill)
                                        setTimeout(() => e.target.select(), 0);
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Email"
                                    className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 px-3 py-2.5 sm:py-3 rounded-xl autofill:bg-black/30 autofill:text-zinc-100 [-webkit-autofill&]:bg-black/30 [-webkit-autofill&]:text-zinc-100 [-webkit-autofill&]:[-webkit-text-fill-color:rgb(244_244_245)] [-webkit-autofill&]:[-webkit-box-shadow:0_0_0px_1000px_rgba(0,0,0,0.3)_inset]"
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] text-red-400 ml-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Message Input */}
                        <div className="space-y-1.5">
                            <div className={cn(
                                "relative flex items-start transition-all duration-300 rounded-xl border",
                                focusedField === 'message'
                                    ? "border-white/20 bg-black/30"
                                    : errors.message
                                        ? "border-red-500/50 bg-black/20"
                                        : "border-white/5 bg-black/20 hover:border-white/10"
                            )}>
                                <MessageSquare className={cn("w-4 h-4 ml-3 mt-3.5 transition-colors flex-shrink-0", focusedField === 'message' ? "text-zinc-300" : "text-zinc-500")} />
                                {/* Textarea wrapper with fade effect at edges */}
                                <div
                                    className="flex-1 relative"
                                    style={{
                                        maskImage: "linear-gradient(to bottom, transparent, white 8%, white 92%, transparent)",
                                        WebkitMaskImage: "linear-gradient(to bottom, transparent, white 8%, white 92%, transparent)",
                                    }}
                                >
                                    <textarea
                                        id="message"
                                        name="message"
                                        maxLength={500}
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={(e) => {
                                            setFocusedField('message');
                                            // Select all text on focus (for autofill)
                                            setTimeout(() => e.target.select(), 0);
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Message"
                                        rows={4}
                                        className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 px-3 py-2.5 sm:py-3 rounded-xl resize-none"
                                    />
                                </div>
                            </div>
                            {/* Character counter */}
                            <div className="flex justify-between items-center">
                                <AnimatePresence>
                                    {errors.message && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-[10px] text-red-400 ml-1"
                                        >
                                            {errors.message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                <span className={cn(
                                    "text-[10px] ml-auto",
                                    formData.message.length > 450 ? "text-amber-400" : "text-zinc-500",
                                    formData.message.length >= 500 && "text-red-400"
                                )}>
                                    {formData.message.length}/500
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || isSuccess}
                            className={cn(
                                "w-full h-11 sm:h-12 mt-2 font-medium rounded-xl transition-all duration-300 text-sm sm:text-base",
                                isSuccess
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                                    : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isSubmitting ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending...</span>
                                    </motion.div>
                                ) : isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Message Sent!</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="send"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </form>
                </div>
            </motion.div >
        </div >
    )
}