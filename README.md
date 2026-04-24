# Utilidades Pérola

Um conjunto de utilitários projetados para facilitar o dia a dia e automatizar processos comuns. Desenvolvido utilizando as mais recentes tecnologias de front-end para web e desktop.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído sobre uma stack moderna e performática:

-   **[Vue 3](https://vuejs.org/)**: Framework JavaScript para construção da interface de usuário, utilizando a Composition API com `<script setup>`.
-   **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para JavaScript, garantindo maior segurança e inteligência no código.
-   **[Vite](https://vitejs.dev/)**: Ferramenta de build super rápida e servidor de desenvolvimento.
-   **[Tauri](https://tauri.app/)**: Framework para construir aplicações desktop menores, mais rápidas e mais seguras utilizando tecnologias web.
-   **[Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)**: Estilização baseada em utilitários com componentes de interface pré-construídos.
-   **[Pinia](https://pinia.vuejs.org/)**: Gerenciamento de estado intuitivo, seguro em tipos e flexível para Vue.
-   **[Vue Router](https://router.vuejs.org/)**: Roteamento oficial para aplicações Vue.js.

## ✨ Funcionalidades Principais

O aplicativo fornece um hub de ferramentas úteis, acessíveis através de uma barra de navegação. As principais visões incluem:

1.  **Calculadora de Lances ME (`/calculator`)**: Uma calculadora rápida para determinar lances baseados em margens específicas para Microempresas (ME), aplicando uma dedução padrão (5.01%).
2.  **Programação do Dia (`/day-scheduler`)**: Uma ferramenta para organizar e editar as tarefas ou fluxos de trabalho do dia, separada em etapas de inserção de arquivos e edição de informações.
3.  **Ajuste de Lote (`/batch-adjustment`)**: Permite carregar arquivos do Excel (`.xlsx`, `.xlsm`) por meio de *drag and drop* para calcular ajustes em lotes de itens, como calcular valores unitários a partir de totais ganhos, lidando com precisão de casas decimais.
4.  **Buscador de Registros (`/register-getter`)**: Lê planilhas do Excel para buscar ou identificar registros faltantes ou não encontrados, relatando os resultados diretamente na interface e em logs do sistema.

## 🚀 Como Começar

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e as dependências necessárias para o desenvolvimento com Tauri instaladas em sua máquina (Rust, dependências de build do SO). O gerenciador de pacotes recomendado no projeto é o **[Bun](https://bun.sh/)**.

### Instalação

1.  Clone o repositório.
2.  Instale as dependências executando na raiz do projeto:

```bash
bun install
```

### Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts úteis:

-   `bun run dev`: Inicia o servidor de desenvolvimento Vite local.
-   `bun run build`: Compila o TypeScript via `vue-tsc` e faz o build do projeto front-end para produção.
-   `bun run preview`: Serve a pasta de build de produção localmente para pré-visualização.
-   `bun run tauri`: Ponto de entrada para a CLI do Tauri (ex: `bun run tauri dev` para rodar o app desktop).
-   `bun run lint`: Executa o ESLint para encontrar e corrigir problemas no código.
-   `bun run format`: Utiliza o Prettier para formatar o código fonte dentro do diretório `src/`.

## 💻 Configuração de IDE Recomendada

Para obter a melhor experiência de desenvolvimento, sugerimos utilizar:

-   [VS Code](https://code.visualstudio.com/)
-   Extensão [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar)
-   Extensão [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
-   Extensão [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
