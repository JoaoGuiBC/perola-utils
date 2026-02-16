import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{vue,ts,mts,tsx}'],
    },

    globalIgnores([
        '**/dist/**',
        '**/dist-ssr/**',
        '**/coverage/**',
        '**/src-tauri/**',
        './src/vite-env.d.ts',
    ]),

    ...pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,

    {
        name: 'app/vue-rules',
        files: ['**/*.vue'],
        rules: {
            'vue/no-deprecated-slot-attribute': [
                'error',
                {
                    ignore: ['PhCaretRight', 'PhCaretLeft'],
                },
            ],
        },
    },

    skipFormatting,
)
