<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { PhPlusCircle, PhTrash } from '@phosphor-icons/vue'

import { useAiConfigStore } from '@/stores/ai-config-store'

const store = useAiConfigStore()
const { isModalOpen, selected_provider, api_key, model_list, selected_model, prompt } =
    storeToRefs(store)

const isLoading = ref(false)
const updated = ref(false)
const newModel = ref('')
const dialogRef = ref<HTMLDialogElement | null>(null)

watch(isModalOpen, (value) => {
    if (value) {
        dialogRef.value?.showModal()
    } else {
        dialogRef.value?.close()
    }
})

function handleClose() {
    store.isModalOpen = !isModalOpen
}

async function handleUpdate() {
    if (
        !selected_provider.value ||
        !api_key.value ||
        !selected_model.value ||
        prompt.value.length < 10
    ) {
        return
    }

    isLoading.value = true
    updated.value = false

    await store.save()

    updated.value = true
    isLoading.value = false
}

function handleInsertNewModel() {
    const trimmedValue = newModel.value.trim()

    if (trimmedValue.length < 1) return
    if (model_list.value.includes(trimmedValue)) return

    model_list.value = [...model_list.value, trimmedValue]

    newModel.value = ''
}

function handleRemoveModel(removedModel: string) {
    if (removedModel === selected_model.value) return

    model_list.value = [...model_list.value.filter((model) => model !== removedModel)]
}
</script>

<template>
    <dialog ref="dialogRef" id="update_prompt_modal" class="modal" @close="handleClose">
        <div class="modal-box max-w-none w-8/12 p-4 relative">
            <div class="flex items-center gap-2 mb-3">
                <h2 class="text-lg/tight font-semibold">Configurações</h2>
                <Transition name="success-text">
                    <span v-if="updated" class="text-xs text-primary">- ATUALIZADO!</span>
                </Transition>
            </div>

            <div class="flex gap-5">
                <section
                    class="relative flex flex-col gap-2 border border-neutral rounded-field p-2 pt-3 h-fit"
                >
                    <span
                        class="absolute z-10 -top-1.5 left-1.5 bg-base-100 px-0.5 font-medium text-sm leading-none"
                    >
                        PROVEDOR
                    </span>

                    <label for="gemini-radio" class="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            name="ai-provider"
                            id="gemini-radio"
                            value="gemini"
                            class="radio radio-xs radio-primary"
                            v-model="selected_provider"
                        />
                        <span class="text-sm leading-none">gemini</span>
                    </label>

                    <label for="anthropic-radio" class="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            name="ai-provider"
                            id="anthropic-radio"
                            value="anthropic"
                            class="radio radio-xs radio-primary"
                            v-model="selected_provider"
                        />
                        <span class="text-sm leading-none">anthropic</span>
                    </label>
                </section>

                <div class="flex flex-col gap-3 flex-1 h-fit">
                    <label for="api-key" class="relative h-fit">
                        <span
                            class="absolute z-10 -top-1.5 left-1.5 bg-base-100 px-0.5 font-medium text-sm leading-none"
                        >
                            CHAVE DA API
                        </span>
                        <input
                            type="text"
                            name="api-key"
                            id="api-key"
                            class="input border border-neutral w-full"
                            v-model="api_key"
                        />
                    </label>

                    <section
                        class="relative flex flex-col gap-2 border border-neutral rounded-field p-2 pt-3 h-fit"
                    >
                        <span
                            class="absolute z-10 -top-1.5 left-1.5 bg-base-100 px-0.5 font-medium text-sm leading-none"
                        >
                            LISTA DE MODELOS
                        </span>

                        <div
                            class="flex w-full items-center gap-3"
                            v-for="model in model_list"
                            :key="model"
                        >
                            <button
                                class="btn btn-xs btn-circle btn-ghost shadow-md text-secondary"
                                @click="() => handleRemoveModel(model)"
                            >
                                <PhTrash class="size-4" />
                            </button>

                            <label :for="model" class="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="ai-model"
                                    :id="model"
                                    :value="model"
                                    class="radio radio-xs radio-primary"
                                    v-model="selected_model"
                                />
                                <span class="text-sm leading-none">{{ model }}</span>
                            </label>
                        </div>

                        <div class="flex w-full items-center gap-3">
                            <button
                                class="btn btn-xs btn-circle btn-ghost shadow-md text-primary"
                                @click="handleInsertNewModel"
                            >
                                <PhPlusCircle class="size-4" />
                            </button>

                            <input
                                type="text"
                                name="new-model"
                                id="new-model"
                                v-model="newModel"
                                class="text-sm px-1 w-48 p-0 border-0 border-b rounded-none border-primary/50"
                            />
                        </div>
                    </section>
                </div>
            </div>

            <p class="text-base leading-4 ml-2 mt-8 font-semibold">PROMPT</p>

            <textarea
                class="textarea textarea-ghost w-full min-h-36 bg-base-200"
                placeholder="prompt"
                v-model="prompt"
            />

            <button
                type="button"
                class="btn btn-md btn-secondary btn-soft mt-6 transition-all"
                :disabled="isLoading"
                @click="handleUpdate"
            >
                <span v-if="isLoading" class="loading loading-ring" />
                {{ isLoading ? 'SALVANDO' : 'SALVAR' }}
            </button>

            <button
                type="button"
                aria-label="close-modal"
                class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
                @click="handleClose"
            >
                ✕
            </button>
        </div>

        <form method="dialog" class="modal-backdrop">
            <button>FECHAR</button>
        </form>
    </dialog>
</template>

<style scoped>
.calendar-enter-active,
.calendar-leave-active {
    transition: opacity 0.5s
        linear(
            0,
            0.01 1%,
            0.042 2.1%,
            0.093 3.2%,
            0.167 4.4%,
            0.337 6.6%,
            0.843 12.4%,
            0.971 14.1%,
            1.074 15.7%,
            1.158 17.3%,
            1.217 18.8%,
            1.259 20.3%,
            1.285 21.9%,
            1.291 24.2%,
            1.265 26.7%,
            1.212 29.3%,
            1.06 35.3%,
            0.994 38.3%,
            0.944 41.6%,
            0.918 45%,
            0.915 47.4%,
            0.922 50.1%,
            1.001 61.6%,
            1.023 68%,
            1.023 73.6%,
            0.995 89%,
            1
        );
}

.calendar-enter-from,
.calendar-leave-to {
    opacity: 0;
}

.calendar-enter-to,
.calendar-leave-from {
    opacity: 1;
}
</style>
