import { createRouter, createWebHistory } from 'vue-router'

const ROUTES = {
    CALCULATOR: '/calculator',
    BID_SUGGESTER: '/bid-suggester',
    REGISTER_FILE_GETTER: '/register-getter',
} as const

const routesConfig = [
    { path: '/:pathMatch(.*)*', component: () => import('@/views/not-found.vue') },
    { path: ROUTES.CALCULATOR, component: () => import('@/views/calculator.vue') },
    { path: ROUTES.BID_SUGGESTER, component: () => import('@/views/bid-suggester.vue') },
    { path: ROUTES.REGISTER_FILE_GETTER, component: () => import('@/views/register-files-getter.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routesConfig,
    strict: true
})

export { router, ROUTES }
