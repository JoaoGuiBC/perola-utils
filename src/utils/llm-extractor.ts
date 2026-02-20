import { env } from '@/env'

type Provider = 'gemini' | 'openai' | 'anthropic'

interface LLMConfig {
    provider: Provider
    apiKey: string
    model: string
    prompt: string
}

async function fileToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    return btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
    )
}

export async function extractEditalData(file: File, prompt: string) {
    const config: LLMConfig = {
        provider: env.VITE_LLM_EXTRACTOR_PROVIDER,
        apiKey: env.VITE_LLM_EXTRACTOR_API_KEY,
        model: env.VITE_LLM_EXTRACTOR_MODEL,
        prompt,
    }

    const base64 = await fileToBase64(file)

    switch (config.provider) {
        case 'gemini':
            return callGemini(base64, config)
        case 'openai':
            return callOpenAI()
        case 'anthropic':
            return callAnthropic(base64, config)
    }
}

async function callGemini(base64: string, { apiKey, model, prompt }: LLMConfig) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: 'application/pdf', data: base64 } },
                        ],
                    },
                ],
                generationConfig: { responseMimeType: 'application/json' },
            }),
        },
    )
    const data = await res.json()
    return JSON.parse(data.candidates[0].content.parts[0].text)
}

async function callAnthropic(base64: string, { apiKey, model, prompt }: LLMConfig) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model,
            max_tokens: 1024,
            system: prompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'document',
                            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
                        },
                    ],
                },
            ],
        }),
    })
    const data = await res.json()
    return JSON.parse(data.content[0].text)
}

async function callOpenAI() {
    // OpenAI não aceita PDF direto
    throw new Error('OpenAI não suporta PDF direto. Use Gemini ou Anthropic.')
}
