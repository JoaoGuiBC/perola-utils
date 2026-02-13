<script setup lang="ts">
import { Auction, createPDF } from '@/utils/create-pdf'

const auctions: Auction[] = [
    {
        municipio_uf: 'Marília - SP',
        hora: '09:00',
        plataforma: 'ComprasNet',
        pe: '90015/2026',
        validade_proposta: '60 dias',
        sistema: 'ABERTO',
        uasg: '092601',
        garantia: null,
        pede_amostra: 'NÃO',
    },
    {
        municipio_uf: 'Recife - PE',
        hora: '09:00',
        plataforma: 'Licitar Digital',
        pe: '004/2026',
        validade_proposta: '4 meses',
        sistema: 'ABERTO',
        uasg: null,
        garantia: null,
        pede_amostra: null,
    },
]

function createSchedule() {
    createPDF(auctions)
}
</script>

<template>
    <main class="flex flex-col items-center pt-6 pb-10 px-6 flex-1 max-h-screen">
        <h1 class="text-primary font-semibold text-lg drop-shadow-md drop-shadow-primary/30">
            PROGRAMAÇÃO DO DIA
        </h1>

        <fieldset class="fieldset mt-2 mb-3">
            <legend v-if="true" class="fieldset-legend p-0">
                Selecione ou arraste o .xlsx ou .xlsm
            </legend>
            <legend v-else class="fieldset-legend p-0">Solte o arquivo</legend>

            <input
                type="file"
                accept=".xlsx,.xlsm"
                :class="[
                    'file-input file-input-neutral file-input-md w-84 drop-shadow-sm transition-all',
                ]"
            />
        </fieldset>

        <button type="button" class="btn" @click="createSchedule">TESTAR</button>
    </main>
</template>
