<script setup lang="ts">
import { themeChange } from 'theme-change'
import { onMounted, ref, watch } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { load, Store } from '@tauri-apps/plugin-store'

let store: Store

const activeTheme = ref('')
const themeList = ref([
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
    { label: 'Cupcake', value: 'cupcake' },
    { label: 'Bumblebee', value: 'bumblebee' },
    { label: 'Esmeralda', value: 'emerald' },
    { label: 'Corporativo', value: 'corporate' },
    { label: 'Synthwave', value: 'synthwave' },
    { label: 'Retro', value: 'retro' },
    { label: 'Cyberpunk', value: 'cyberpunk' },
    { label: 'Valentine', value: 'valentine' },
    { label: 'Halloween', value: 'halloween' },
    { label: 'Jardim', value: 'garden' },
    { label: 'Floresta', value: 'forest' },
    { label: 'Aqua', value: 'aqua' },
    { label: 'Lofi', value: 'lofi' },
    { label: 'Pastel', value: 'pastel' },
    { label: 'Fantasia', value: 'fantasy' },
    { label: 'Wireframe', value: 'wireframe' },
    { label: 'Preto', value: 'black' },
    { label: 'Luxo', value: 'luxury' },
    { label: 'Dracula', value: 'dracula' },
    { label: 'CMYK', value: 'cmyk' },
    { label: 'Outono', value: 'autumn' },
    { label: 'Negócios', value: 'business' },
    { label: 'Ácido', value: 'acid' },
    { label: 'Limonada', value: 'lemonade' },
    { label: 'Noite', value: 'night' },
    { label: 'Café', value: 'coffee' },
    { label: 'Inverno', value: 'winter' },
    { label: 'Dim', value: 'dim' },
    { label: 'Nórdico', value: 'nord' },
    { label: 'Pôr do sol', value: 'sunset' },
    { label: 'Caramelo', value: 'caramellatte' },
    { label: 'Abismo', value: 'abyss' },
    { label: 'Seda', value: 'silk' },
])

watch(activeTheme, async () => {
    await store.set('theme', activeTheme.value)
    await store.save()
})

onMounted(async () => {
    store = await load('settings.json')
    const savedTheme = (await store.get<string>('theme')) || 'default'

    activeTheme.value = savedTheme

    document.documentElement.setAttribute('data-theme', savedTheme)

    themeChange(false)
})
</script>

<template>
    <div class="dropdown dropdown-center absolute z-30 right-4 top-3">
        <div tabindex="0" role="button" class="btn m-1">
            Tema

            <PhCaretDown />
        </div>

        <ul
            tabindex="1"
            class="dropdown-content bg-base-300 rounded-box z-1 w-fit p-1.5 shadow-2xl h-[64vh] overflow-auto"
        >
            <li v-for="themeOption in themeList" :key="themeOption.value">
                <input
                    data-choose-theme
                    type="radio"
                    name="theme-dropdown"
                    class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                    :aria-label="themeOption.label"
                    :value="themeOption.value"
                    :checked="themeOption.value === activeTheme"
                    v-on:click="() => (activeTheme = themeOption.value)"
                />
            </li>
        </ul>
    </div>
</template>
