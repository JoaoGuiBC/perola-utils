<script setup lang="ts">
import { computed } from 'vue'

import { RowSchemaType } from '../schemas/table-data-schema'
import { currencyFormatter } from '../utils/currency-formatter'

const props = defineProps<RowSchemaType>()

const bestBid = defineModel<number>('best-bid')

const formattedMinimum = computed(() => {
    const formatted = currencyFormatter(props.minimo)
    const numericValue = props.minimo.toFixed(4)
    return formatted.replace(/[\d,]+\.?\d*/, numericValue.replace('.', ','))
})
const suggestedBid = computed(() => {
    if (!bestBid.value) return ''

    if (bestBid.value <= props.minimo) return currencyFormatter(props.minimo)

    const percentageReduction = bestBid.value * 0.8

    if (percentageReduction >= props.minimo) return currencyFormatter(percentageReduction)

    const halvedDifference = (bestBid.value - props.minimo) / 2

    return currencyFormatter(props.minimo + halvedDifference)
})
</script>

<template>
    <tr class="transition-colors hover:bg-base-200">
        <td class="text-start select-none">
            <strong class="text-lg">{{ props.item }}</strong>
        </td>

        <td>
            <span class="text-xs line-clamp-3 select-none">{{ props.produto }}</span>
        </td>

        <td>
            <span class="text-base">{{ formattedMinimum }}</span>
        </td>

        <td>
            <input
                id=""
                name=""
                type="number"
                v-model="bestBid"
                class="bg-base-300/50 p-2 rounded-field w-32"
            />
        </td>

        <td>
            <strong class="text-base">{{ suggestedBid }}</strong>
        </td>
    </tr>
</template>
