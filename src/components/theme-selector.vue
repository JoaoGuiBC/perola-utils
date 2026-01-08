<script setup lang="ts">
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'

onMounted(() => {
    themeChange(false)
})
</script>

<template>
<div class="dropdown dropdown-center absolute z-30 right-4 top-3">

    <div tabindex="0" role="button" class="btn m-1">
        Tema
        
        <PhCaretDown />
    </div>

    <ul tabindex="1" class="dropdown-content bg-base-300 rounded-box z-1 w-fit p-1.5 shadow-2xl h-[64vh] overflow-auto">
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Claro"
                value="default"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Escuro"
                value="dark"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Cupcake"
                value="cupcake"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Bumblebee"
                value="bumblebee"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Esmeralda"
                value="emerald"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Corporativo"
                value="corporate"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Synthwave"
                value="synthwave"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Retro"
                value="retro"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Cyberpunk"
                value="cyberpunk"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Valentine"
                value="valentine"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Halloween"
                value="halloween"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Jardim"
                value="garden"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Floresta"
                value="forest"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Aqua"
                value="aqua"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Lofi"
                value="lofi"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Pastel"
                value="pastel"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Fantasia"
                value="fantasy"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Wireframe"
                value="wireframe"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Preto"
                value="black"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Luxo"
                value="luxury"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Dracula"
                value="dracula"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="CMYK"
                value="cmyk"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Outono"
                value="autumn"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Negócios"
                value="business"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Ácido"
                value="acid"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Limonada"
                value="lemonade"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Noite"
                value="night"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Café"
                value="coffee"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Inverno"
                value="winter"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Dim"
                value="dim"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Nórdico"
                value="nord"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Pôr do sol"
                value="sunset"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Caramelo"
                value="caramellatte"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Abismo"
                value="abyss"
            />
        </li>
        <li>
            <input
                data-choose-theme
                type="radio"
                name="theme-dropdown"
                class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-center"
                aria-label="Seda"
                value="silk"
            />
        </li>
    </ul>
</div>
</template>
