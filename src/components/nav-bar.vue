<script setup lang="ts">
import { computed } from 'vue'

import { ROUTES, router } from '@/router'

const ROUTE_INDEX_MAP = new Map(ROUTES.map((route, index) => [route.ROUTE_PATH, index]))

const { value: currentRoute } = computed(() => router.currentRoute)
const selectorMarginTop = computed(() => {
    // let size = 10

    // ROUTES.forEach((route, index) => {
    //     if (currentRoute.value.path === route.ROUTE_PATH) size = size + index * 40
    // })

    // return `top-[${size}px]`
    // if (currentRoute.value.path === '/calculator') return 'top-[10px]'
    // if (currentRoute.value.path === '/batch-adjustment') return 'top-[50px]'
    // if (currentRoute.value.path === '/bid-suggester') return 'top-[90px]'
    // if (currentRoute.value.path === '/register-getter') return 'top-[130px]'

    // return 'top-[20px]'

    const routeIndex = ROUTE_INDEX_MAP.get(currentRoute.value.path as `/${string}`)
    const size = routeIndex !== undefined ? 10 + routeIndex * 40 : 10

    return `top-[${size}px]`
})
const selectorClass = computed(
    () =>
        `absolute size-9 left-1/2 -translate-x-1/2 bg-primary/25 z-0 rounded-field transition-all ${selectorMarginTop.value}`,
)
</script>

<template>
    <nav
        class="sticky top-4 flex flex-col h-fit gap-2 mr-4 p-3 rounded-box bg-base-200 drop-shadow-lg"
    >
        <div aria-hidden="true" :class="selectorClass" />

        <RouterLink
            v-for="route in ROUTES"
            :key="route.ROUTE_PATH"
            :to="route.ROUTE_PATH"
            class="z-10"
        >
            <component :is="route.ROUTE_ICON" :size="32" />
        </RouterLink>
    </nav>
</template>
