<script setup lang="ts">
import TableRow from './bid-suggester-table-row.vue'

import { RowSchemaType } from '../schemas/table-data-schema'

const props = defineProps<{
    tableData: Array<RowSchemaType>
}>()
</script>

<template>
    <table class="table">
        <thead>
            <tr>
                <th>Item</th>
                <th>Nome/Descrição</th>
                <th>Valor mínimo</th>
                <th>Melhor lance</th>
                <th>Lance fechado</th>
            </tr>
        </thead>
        <tbody>
            <TableRow
                v-for="row in props.tableData"
                :key="row.item"
                :item="row.item"
                :produto="row.produto"
                :minimo="row.minimo"
            />
        </tbody>
    </table>
</template>
