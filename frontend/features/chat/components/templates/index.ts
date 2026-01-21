export { AboutMeTemplate } from './about-me-template'
export { StandOutTemplate } from './stand-out-template'

// Template mapping for quick lookup
export const TEMPLATE_MAP = {
    "Tell me about yourself": "AboutMeTemplate",
    "What makes you stand out?": "StandOutTemplate",
    // Add more mappings as we create more templates
} as const

export type TemplateKey = keyof typeof TEMPLATE_MAP
