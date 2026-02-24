<script setup lang="ts">
import { computed } from 'vue'

import { ROUTES, router } from '@/router'

const ROUTE_INDEX_MAP = new Map(ROUTES.map((route, index) => [route.ROUTE_PATH, index]))

const { value: currentRoute } = computed(() => router.currentRoute)

const selectorMarginTop = computed(() => {
    const routeIndex = ROUTE_INDEX_MAP.get(currentRoute.value.path as `/${string}`)
    return `${routeIndex !== undefined ? 0.625 + routeIndex * 2.5 : 0.625}rem`
})
</script>

<template>
    <nav class="sticky top-4 flex flex-col h-fit gap-2 p-3 rounded-box bg-base-200 drop-shadow-lg">
        <div
            aria-hidden="true"
            class="absolute size-9 left-1/2 -translate-x-1/2 bg-primary/25 z-0 rounded-field transition-all"
            :style="{ top: selectorMarginTop }"
        />

        <RouterLink
            v-for="route in ROUTES"
            :key="route.ROUTE_PATH"
            :to="route.ROUTE_PATH"
            class="z-10"
        >
            <component class="size-8" :is="route.ROUTE_ICON" />
        </RouterLink>
    </nav>
</template>
