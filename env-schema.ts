import { z } from 'zod'
import { defineConfig } from '@julr/vite-plugin-validate-env'

const PROVIDERS = ['gemini', 'openai', 'anthropic'] as const

export default defineConfig({
    validator: "standard",
    schema: {
        VITE_LLM_EXTRACTOR_PROVIDER: z.enum(PROVIDERS),
        VITE_LLM_EXTRACTOR_API_KEY: z.string(),
        VITE_LLM_EXTRACTOR_MODEL: z.string(),
        VITE_LLM_EXTRACTOR_PROMPT: z.string()
    }
})
