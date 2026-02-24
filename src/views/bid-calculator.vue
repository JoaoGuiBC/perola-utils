<script setup lang="ts">
import { computed } from 'vue'

import { currencyFormatter } from '@/utils/currency-formatter'

const meBid = defineModel<number>('me-bid')

const suggestedBid = computed(() => {
    if (!meBid.value) return ''

    const suggestedBid = meBid.value - (meBid.value / 100) * 5.01

    return currencyFormatter(suggestedBid)
})
</script>

<template>
    <main class="flex flex-col items-center gap-4 py-6 px-4 flex-1">
        <h1 class="text-primary font-semibold text-lg mb-6 drop-shadow-md drop-shadow-primary/30">
            CALCULADORA DE LANCES REFERENTES A ME's
        </h1>

        <div class="flex items-center justify-between w-56">
            <span>LANCE DA ME:</span>
            <input
                id=""
                name=""
                type="number"
                v-model="meBid"
                class="input input-sm bg-base-300/50 p-2 rounded-field w-28 outline-0 text-center text-base"
            />
        </div>

        <div class="flex items-center justify-between w-56">
            <span>SEU LANCE:</span>
            <strong class="w-28 text-center">{{ suggestedBid }}</strong>
        </div>
    </main>
</template>
