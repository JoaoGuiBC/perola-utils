import { z } from 'zod'

const PROVIDERS = ['gemini', 'openai', 'anthropic'] as const

const envSchema = z.object({
    VITE_LLM_EXTRACTOR_PROVIDER: z.enum(PROVIDERS),
    VITE_LLM_EXTRACTOR_API_KEY: z.string(),
    VITE_LLM_EXTRACTOR_MODEL: z.string(),
    VITE_LLM_EXTRACTOR_PROMPT: z.string(),
})

function validateEnv() {
    const { data, error } = envSchema.safeParse(import.meta.env)

    if (error) {
        if (error instanceof z.ZodError) {
            if (import.meta.env.DEV) {
                console.error('❌ Erro nas variáveis de ambiente:')
                console.error(z.treeifyError(error))
            }

            throw new Error(
                import.meta.env.DEV
                    ? 'Variáveis de ambiente inválidas ou ausentes'
                    : 'Erro de configuração da aplicação',
            )
        }
        throw error
    }

    return data
}

export const env = validateEnv()
