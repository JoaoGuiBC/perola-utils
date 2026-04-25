<script setup lang="ts">
import { computed } from 'vue'

import { currencyFormatter } from '@/utils/currency-formatter'

const PERCENTAGE_VALUES = [
    { label: '0,5%', value: 0.5, defaultChecked: false },
    { label: '1%', value: 1, defaultChecked: false },
    { label: '5,01%', value: 5.01, defaultChecked: true },
] as const

const competitorBid = defineModel<number>('competitor-bid')
const percentage = defineModel<number>('percentage', { default: 5.01 })

const suggestedBid = computed(() => {
    if (!competitorBid.value || !percentage.value) return ''

    const suggestedBid = competitorBid.value - (competitorBid.value / 100) * percentage.value

    return currencyFormatter(suggestedBid)
})
</script>

<template>
    <main class="flex flex-col items-center gap-4 py-6 px-4 flex-1">
        <h1 class="text-primary font-semibold text-lg mb-6 drop-shadow-md drop-shadow-primary/30">
            CALCULADORA DE LANCES
        </h1>

        <div class="flex flex-col h-fit items-center justify-center">
            <span class="font-semibold text-sm opacity-90">Porcentagem</span>
            <select
                class="select select-sm select-ghost text-base w-24 justify-center"
                v-model="percentage"
            >
                <option
                    v-for="percentage in PERCENTAGE_VALUES"
                    :key="percentage.label"
                    :value="percentage.value"
                >
                    {{ percentage.label }}
                </option>
            </select>
        </div>

        <div class="flex items-center gap-4 justify-center w-80">
            <span>LANCE CONCORRENTE:</span>
            <input
                id=""
                name=""
                type="number"
                v-model="competitorBid"
                class="input input-sm bg-base-300/50 p-2 rounded-field w-28 outline-0 text-center text-base"
            />
        </div>

        <div class="flex items-center gap-4 justify-center w-80">
            <span>SEU LANCE:</span>
            <strong class="w-28 text-center">{{ suggestedBid }}</strong>
        </div>
    </main>
</template>
