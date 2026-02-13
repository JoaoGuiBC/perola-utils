import { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { PhCalculator, PhClipboardText, PhArchive, PhCurrencyCircleDollar } from '@phosphor-icons/vue'

type RoutePath = `/${string}`

type Route = { ROUTE_PATH: RoutePath; ROUTE_FILE: () => Promise<Component>; ROUTE_ICON: Component }

const ROUTES: Array<Route> = [
    {
        ROUTE_PATH: '/calculator',
        ROUTE_FILE: () => import(/* @vite-ignore */ '@/views/bid-calculator.vue'),
        ROUTE_ICON: PhCalculator,
    },
    {
        ROUTE_PATH: '/batch-adjustment',
        ROUTE_FILE: () => import(/* @vite-ignore */ '@/views/batch-adjustment.vue'),
        ROUTE_ICON: PhArchive,
    },
    {
        ROUTE_PATH: '/bid-suggester',
        ROUTE_FILE: () => import(/* @vite-ignore */ '@/views/bid-suggester.vue'),
        ROUTE_ICON: PhCurrencyCircleDollar,
    },
    {
        ROUTE_PATH: '/register-getter',
        ROUTE_FILE: () => import(/* @vite-ignore */ '@/views/register-files-getter.vue'),
        ROUTE_ICON: PhClipboardText,
    },
]

const routesConfig = [
    { path: '/:pathMatch(.*)*', component: () => import('@/views/not-found.vue') },
    ...ROUTES.map((route) => ({ path: route.ROUTE_PATH, component: route.ROUTE_FILE })),
]

const router = createRouter({
    history: createWebHistory(),
    routes: routesConfig,
    strict: true,
})

export { router, ROUTES }
