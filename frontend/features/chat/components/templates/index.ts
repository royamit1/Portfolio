export { AboutMeTemplate } from './about-me-template'
export { StandOutTemplate } from './stand-out-template'
export { GetInTouchTemplate } from './get-in-touch-template'

// Template mapping for quick lookup
export const TEMPLATE_MAP = {
    "Tell me about yourself": "AboutMeTemplate",
    "What makes you stand out?": "StandOutTemplate",
    "How do I get in touch?": "GetInTouchTemplate",
} as const

export type TemplateKey = keyof typeof TEMPLATE_MAP
