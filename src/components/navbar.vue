<script setup lang="ts">
import { PhCalculator, PhClipboardText, PhCurrencyCircleDollar } from '@phosphor-icons/vue'

import { ROUTES, router } from '@/router'
import { computed } from 'vue';

const { value: route } = computed(() => router.currentRoute)
const selectorMarginTop = computed(() => {
    if (route.value.path === ROUTES.CALCULATOR) return 'top-[10px]'
    if (route.value.path === ROUTES.BID_SUGGESTER) return 'top-[50px]'
    if (route.value.path === ROUTES.REGISTER_FILE_GETTER) return 'top-[90px]'
})
const selectorClass = computed(
    () => `absolute size-9 left-1/2 -translate-x-1/2 bg-primary/25 z-0 rounded-lg transition-all ${selectorMarginTop.value}`
)
</script>

<template>
    <nav class="sticky top-4 flex flex-col h-fit gap-2 mr-4 p-3 rounded-box bg-base-200 drop-shadow-lg">
        <div aria-hidden="true" :class="selectorClass" />

        <RouterLink :to="ROUTES.CALCULATOR" class="z-10">
            <PhCalculator :size="32" />
        </RouterLink>
        <RouterLink :to="ROUTES.BID_SUGGESTER">
            <PhCurrencyCircleDollar :size="32" />
        </RouterLink>
        <RouterLink :to="ROUTES.REGISTER_FILE_GETTER">
            <PhClipboardText :size="32" />
        </RouterLink>
    </nav>
</template>
