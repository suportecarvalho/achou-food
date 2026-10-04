# 🛵 Achou Food - Plataforma de Delivery Web

Aplicação web moderna, responsiva e de alta performance de delivery de comida, desenvolvida do zero utilizando a mesma stack tecnológica e padrões visuais do **Lovable**.

---

## 🚀 Tecnologias Utilizadas (Stack Lovable)

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Bundler**: [Vite](https://vite.dev/) com Hot Module Replacement (HMR)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com tokens de design customizados
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/) patterns + componentes sob medida
- **Ícones**: [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`)
- **Navegação & Roteamento**: [React Router v7](https://reactrouter.com/)
- **Backend & Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL, Autenticação, RLS, Storage) com fallback local inteligente
- **Controle de Versão**: Git + GitHub
- **Hospedagem & Deploy**: Vercel (`vercel.json` pré-configurado)

---

## 🎨 Design System e Especificações Visuais

O projeto implementa com 100% de fidelidade os estilos e componentes fornecidos:

### 1. Cores
- **Brand**:
  - `red-base`: `#EA1D2C` (Cor primária e botões de destaque)
  - `red-dark`: `#B81723` (Botão de remover e hover primário)
  - `red-transparent_30`: `rgba(232, 41, 51, 0.30)` (Tons suaves e badges)
- **Feedback**:
  - `success-base`: `#069F62`
  - `success-transparent_20`: `rgba(6, 159, 98, 0.20)`
- **Grayscale**:
  - `gray-100`: `#FAFAFA`
  - `gray-200`: `#EBEBEB`
  - `gray-300`: `#E0DCDC`
  - `gray-400`: `#5C5656`
  - `gray-500`: `#423A3A`
  - `gray-600`: `#1F1818`
- **Transparent & Gradient**:
  - `gray-transparent_20`, `gray-transparent_40`, `gray-transparent_80`
  - `white-gradient`: `linear-gradient(163deg, #FFF 12.36%, rgba(255, 255, 255, 0.60) 32.02%, ...)`

### 2. Tipografia
- **Família Tipográfica**: **Noto Sans** (Google Fonts)
- **Escala Oficial**:
  - `Title Lg`: 18px / 140% / SemiBold (600)
  - `Title Md`: 16px / 140% / SemiBold (600)
  - `Title Sm`: 14px / 140% / SemiBold (600)
  - `Body Md`: 16px / 140% / Regular (400)
  - `Body Sm`: 14px / 140% / Regular (400)
  - `Body Xs`: 12px / 140% / Regular (400)
  - `LABEL XS`: 12px / 140% / SemiBold (600)
  - `LABEL 2XS`: 10px / 140% / SemiBold (600)

### 3. Componentes Especiais
- **TabBar**: Dock de navegação flutuante inferior com abas **Home** e **Order**, efeitos de blur e indicador de estado ativo.
- **ToggleList**: Alternador de visualização entre formato em **Lista** e no **Mapa interativo**.
- **Button**: Variantes `Label Button Primary`, `Label Button Secondary`, `Icon Button Secondary` e botão `Remover`.
- **Tag**: Pílula de categoria com estados `Default` e `Selected` (vermelho base).
- **Restaurant Card**: Estados `Default`, `Removable` e botão de exclusão `Remover`.
- **Item (Prato/Produto)**: Estados `Not added` (com botão de adição rápida `+`) e `Added` (com seletor interativo `- 1 +`).

---

## 🛠️ Como Executar Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`.

### 3. Executar o Build de Produção
```bash
npm run build
npm run preview
```

---

## 🗄️ Integração com Supabase

1. Crie um projeto no [Supabase](https://supabase.com).
2. Acesse a aba **SQL Editor** no painel do Supabase.
3. Copie e cole todo o conteúdo do arquivo [`supabase/schema.sql`](file:///c:/Users/lucas/Documents/Achou%20Food/supabase/schema.sql) e clique em **Run**.
4. No arquivo `.env`, insira as chaves do seu projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```
> **Nota**: O sistema possui fallback local inteligente. Caso nenhuma chave seja informada, a aplicação funcionará normalmente utilizando o mock data do design system e salvando dados no `localStorage`.

---

## 🌐 Deploy na Vercel

O projeto está pronto para deploy imediato na Vercel:

1. Suba o projeto para o GitHub:
```bash
git init
git add .
git commit -m "feat: initial commit achou food"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/achou-food.git
git push -u origin main
```
2. Na Vercel, clique em **Add New Project** e importe o repositório.
3. As configurações de Build serão detectadas automaticamente:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Se desejar, adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas Environment Variables.
5. Clique em **Deploy**. O arquivo `vercel.json` garante o suporte a todas as rotas do React Router.

---

## 🧭 Rotas da Aplicação

- `/`: Página inicial com restaurantes, categorias, busca e alternador Lista/Mapa.
- `/restaurant/:id`: Cardápio do restaurante com categorias e itens com contador `- 1 +`.
- `/cart`: Sacola de compras, seleção de endereço, pagamento (Pix, Cartão, Dinheiro) e finalização.
- `/orders`: Acompanhamento de pedidos em tempo real (Recebido, Em Preparo, Saiu para Entrega, Entregue).
- `/favorites`: Gerenciamento de restaurantes favoritos com o botão `Remover`.
- `/components`: Catálogo vivo e interativo do Design System com todas as cores, tipografia, ícones e componentes.
