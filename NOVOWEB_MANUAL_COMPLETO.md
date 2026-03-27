# NovoWeb — Manual Completo para IA

> **Para a IA que vai ler este arquivo:**
> Este é o **único documento de referência** para criar ou modificar qualquer serviço NovoWeb. Ele unifica o manual de design, o manual de estrutura e o design system em um só lugar.
> Siga **cada instrução ao pé da letra**. Não invente nada que não esteja aqui. Todos os serviços (Viso, TIME, e qualquer produto futuro) devem ser construídos exatamente com estes padrões — é o que mantém tudo padronizado visualmente e estruturalmente, mesmo que cada serviço tenha sua **própria funcionalidade**.

---

## Sumário

1. [O que é a NovoWeb](#1-o-que-é-a-novoweb)
2. [Regras Absolutas — Nunca Viole](#2-regras-absolutas--nunca-viole)
3. [Estrutura de Arquivos Obrigatória](#3-estrutura-de-arquivos-obrigatória)
4. [Cabeçalho HTML Obrigatório](#4-cabeçalho-html-obrigatório)
5. [CSS Completo do Boilerplate (design.css)](#5-css-completo-do-boilerplate-designcss)
6. [HTML Completo do Body — Boilerplate](#6-html-completo-do-body--boilerplate)
7. [JavaScript Base Obrigatório](#7-javascript-base-obrigatório)
8. [notifications.js](#8-notificationsjs)
9. [Firebase — Configuração Padrão](#9-firebase--configuração-padrão)
10. [Tipografia — Escala Completa](#10-tipografia--escala-completa)
11. [Paleta de Cores — Tokens e Significado](#11-paleta-de-cores--tokens-e-significado)
12. [Dark Mode](#12-dark-mode)
13. [Background Blobs (Identidade Visual)](#13-background-blobs-identidade-visual)
14. [Espaçamento e Grid](#14-espaçamento-e-grid)
15. [Componentes — Botões](#15-componentes--botões)
16. [Componentes — Formulários](#16-componentes--formulários)
17. [Componentes — Cards](#17-componentes--cards)
18. [Componentes — Badges e Status](#18-componentes--badges-e-status)
19. [Componentes — Barra de Progresso](#19-componentes--barra-de-progresso)
20. [Componentes — Filtros por Status](#20-componentes--filtros-por-status)
21. [Componentes — Modal / Overlay](#21-componentes--modal--overlay)
22. [Componentes — Header](#22-componentes--header)
23. [Componentes — Sidebar](#23-componentes--sidebar)
24. [Animações e Transições](#24-animações-e-transições)
25. [Responsividade Obrigatória](#25-responsividade-obrigatória)
26. [Performance — Regras de Ouro](#26-performance--regras-de-ouro)
27. [Arquitetura JavaScript — Estado e Estrutura](#27-arquitetura-javascript--estado-e-estrutura)
28. [Sistema de Views (SPA)](#28-sistema-de-views-spa)
29. [Autenticação](#29-autenticação)
30. [Firebase — Padrões CRUD](#30-firebase--padrões-crud)
31. [Renderização Dinâmica e Feedback](#31-renderização-dinâmica-e-feedback)
32. [Navegação na Sidebar](#32-navegação-na-sidebar)
33. [Dropzone (Drag & Drop)](#33-dropzone-drag--drop)
34. [Progresso — Barra e Anel SVG](#34-progresso--barra-e-anel-svg)
35. [Cloud Functions](#35-cloud-functions)
36. [Convenções de Nomenclatura](#36-convenções-de-nomenclatura)
37. [Segurança](#37-segurança)
38. [Como Nomear o Serviço na Interface](#38-como-nomear-o-serviço-na-interface)
39. [Padrões de Comportamento Esperados](#39-padrões-de-comportamento-esperados)
40. [Checklist Final Antes de Entregar](#40-checklist-final-antes-de-entregar)
41. [Exemplo de Prompt para a IA](#41-exemplo-de-prompt-para-a-ia)

---

## 1. O que é a NovoWeb

A NovoWeb é uma empresa de tecnologia. Ela cria **serviços web independentes**, cada um com sua funcionalidade própria, porém todos compartilhando:

- A mesma **identidade visual** (cores, fontes, blobs de background, logo)
- A mesma **estrutura de código** (SPA em HTML/CSS/JS puro, sem frameworks)
- Os mesmos **componentes** (botões, cards, modais, sidebar, header)
- O mesmo **comportamento** (dark mode, responsividade, animações, Firebase)

Cada serviço tem um **nome próprio** que aparece abaixo do logo "NovoWeb" em azul (`--accent`).
Exemplos de serviços existentes: **Viso**, **TIME**.

> **Ponto chave:** O Viso e o TIME parecem "do mesmo sistema", mas fazem coisas completamente diferentes. Essa é a ideia — mesma aparência, diferente propósito.

---

## 2. Regras Absolutas — Nunca Viole

### CSS
```
❌ NUNCA use Tailwind, Bootstrap ou qualquer framework CSS externo
❌ NUNCA use cores hexadecimais diretamente nos componentes — sempre via variável CSS
❌ NUNCA use backdrop-filter em nenhum elemento (login card, sidebar, modal, header)
❌ NUNCA anime width, height, top, left, right, bottom
❌ NUNCA use filter:blur() em elementos com position:fixed ou que são animados
❌ NUNCA crie múltiplos arquivos CSS — tudo em um único design.css
❌ NUNCA use IDs para estilizar — IDs são exclusivos para JavaScript

✅ SEMPRE use as variáveis CSS do :root definidas neste documento
✅ SEMPRE implemente dark mode em todos os componentes
✅ SEMPRE inclua os 4 blobs de background no início do <body>
✅ SEMPRE use a fonte Inter do Google Fonts
✅ SEMPRE carregue Font Awesome de forma não-bloqueante
✅ SEMPRE salve a preferência de tema no localStorage
✅ SEMPRE use SPA com .view-container + classe .active
✅ SEMPRE nomeie o serviço abaixo do logo NovoWeb com a classe .sidebar-logo-sub
```

### JavaScript
```
❌ NUNCA use frameworks JS (React, Vue, Angular, Svelte)
❌ NUNCA divida o código em múltiplos arquivos JS sem motivo claro
❌ NUNCA use IDs duplicados no HTML — cada ID é único e global
❌ NUNCA manipule views via CSS display inline — use sempre a classe .active
❌ NUNCA escreva lógica de negócio dentro de event listeners diretos
❌ NUNCA deixe credenciais Firebase expostas sem restringir no Console
❌ NUNCA faça fetch de dados toda vez que uma view é exibida — use listeners
❌ NUNCA crie elementos DOM por innerHTML com dados do usuário sem sanitizar

✅ SEMPRE inicialize o Firebase antes de qualquer outra coisa no <script>
✅ SEMPRE use um objeto/variáveis de estado global (let state = {})
✅ SEMPRE separe a lógica em funções nomeadas e reutilizáveis
✅ SEMPRE use real-time listeners (onSnapshot) para dados que mudam
✅ SEMPRE remova listeners (unsubscribe) ao trocar de view/contexto
✅ SEMPRE sanitize dados do Firestore antes de inserir no DOM
✅ SEMPRE debounce operações que disparam no onSnapshot frequentemente
```

---

## 3. Estrutura de Arquivos Obrigatória

```
NomeDoServico/
├── index.html          ← Toda a aplicação (SPA)
├── design.css          ← Todo o CSS (copie o boilerplate da seção 5)
├── notifications.js    ← Toasts e helpers (copie da seção 8)
├── firebase.json       ← Hosting config
├── firestore.rules     ← Regras do banco
├── .firebaserc         ← Projeto Firebase
├── _redirects          ← Se usar Netlify
└── favicon/
    ├── favicon.svg
    ├── favicon.ico
    └── site.webmanifest
```

> O JavaScript da aplicação pode ir em um `<script>` inline no final do `index.html` (para serviços simples) ou em um `app.js` separado. Mantenha um único arquivo JS principal.

---

## 4. Cabeçalho HTML Obrigatório

Copie este `<head>` exatamente. Substitua apenas `[NOME DO SERVIÇO]`:

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NovoWeb — [NOME DO SERVIÇO]</title>

  <!-- Fonte Inter — não-bloqueante -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <!-- Firebase SDK (remova se não usar Firebase) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

  <!-- CSS do serviço -->
  <link rel="stylesheet" href="design.css" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="favicon/favicon.svg" />
  <link rel="alternate icon" href="favicon/favicon.ico" />
  <link rel="apple-touch-icon" href="favicon/favicon.svg" />
  <link rel="manifest" href="favicon/site.webmanifest" />

  <!-- Font Awesome — não-bloqueante (não troque este padrão) -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    media="print"
    onload="this.media='all'"
  />
  <noscript>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </noscript>
</head>
```

---

## 5. CSS Completo do Boilerplate (design.css)

Cole este bloco inteiro no `design.css` de qualquer novo serviço. É a base de tudo.

### 5.1 — Variáveis e Reset

```css
/* ========== TOKENS DE DESIGN — NOVOWEB ========== */
:root {
  --primary:       #0d0d0d;
  --secondary:     #1a1a1a;
  --accent:        #111bd9;    /* Azul NovoWeb — cor principal da marca */
  --success:       #03fa6e;    /* Verde neon — usado em 100% concluído */

  --bg-light:      #f0f2f8;
  --bg-dark:       #141414;
  --bg-alpha:      rgba(255, 255, 255, 0.9); /* Painéis semitransparentes sobre blobs */

  --surface-light: #ffffff;
  --surface-dark:  #1f1f1f;

  --text-light:    #1a1a1a;
  --text-dark:     #f2f2f2;
  --muted:         #848484;

  --border-light:  #d8dcea;
  --border-dark:   #3a3a3a;

  /* Status de itens/tarefas/fluxos */
  --planned:       #059669;   /* Verde — planejado */
  --in-progress:   #3b82f6;   /* Azul — em andamento */
  --done:          #03fa6e;   /* Verde neon — concluído */
  --fix:           #f59e0b;   /* Âmbar — corrigir/atenção */

  color-scheme: light;
}

/* ========== DARK MODE ========== */
html.dark-mode {
  --primary:       #0f0f10;
  --secondary:     #1a1a1d;
  --bg-light:      #0f0f10;
  --bg-dark:       #1a1a1d;
  --bg-alpha:      rgba(15, 15, 16, 0.82);
  --surface-light: #1f1f23;
  --surface-dark:  #2a2a2f;
  --text-light:    #f2f2f2;
  --text-dark:     #c8c8c8;
  --border-light:  #2e2e33;
  --border-dark:   #3a3a40;
  --muted:         #848484;
  --accent:        #111bd9;
  --planned:       #059669;
  --in-progress:   #3b82f6;
  --done:          #03fa6e;
  --fix:           #f59e0b;
  color-scheme: dark;
}

/* ========== RESET ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  background-color: var(--bg-light);
  transition: background-color 0.3s ease;
}

body {
  font-family: "Inter", sans-serif;
  background-color: transparent;
  color: var(--text-light);
  line-height: 1.6;
  display: flex;
  min-height: 100vh;
  position: relative;
  overscroll-behavior: none;
}

/* ========== UTILITY ========== */
.hidden { display: none !important; }
```

### 5.2 — Background Blobs (identidade visual obrigatória)

```css
/* ========== BLOBS DE BACKGROUND ========== */
/* REGRA: Nunca adicione filter:blur aqui. A suavidade vem só do radial-gradient. */
.bg-blobs {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
}

/* Blob 1 — laranja/vermelho — superior-esquerdo */
.blob-1 {
  width: clamp(600px, 70vw, 900px);
  height: clamp(560px, 65vw, 860px);
  top: -25%; left: -20%;
  background: radial-gradient(ellipse at 40% 40%,
    rgba(245, 166, 35, 0.55) 0%,
    rgba(239, 68, 68, 0.30) 35%,
    transparent 70%);
}

/* Blob 2 — azul/ciano — superior-direito */
.blob-2 {
  width: clamp(560px, 65vw, 860px);
  height: clamp(520px, 60vw, 820px);
  top: -20%; right: -18%;
  background: radial-gradient(ellipse at 55% 40%,
    rgba(59, 130, 246, 0.52) 0%,
    rgba(6, 182, 212, 0.22) 40%,
    transparent 70%);
}

/* Blob 3 — índigo/azul — inferior-esquerdo */
.blob-3 {
  width: clamp(540px, 62vw, 840px);
  height: clamp(500px, 58vw, 800px);
  bottom: -20%; left: -15%;
  background: radial-gradient(ellipse at 45% 55%,
    rgba(99, 102, 241, 0.50) 0%,
    rgba(59, 130, 246, 0.24) 40%,
    transparent 70%);
}

/* Blob 4 — rosa/laranja — inferior-direito */
.blob-4 {
  width: clamp(580px, 68vw, 880px);
  height: clamp(540px, 63vw, 840px);
  bottom: -18%; right: -15%;
  background: radial-gradient(ellipse at 55% 55%,
    rgba(249, 115, 22, 0.52) 0%,
    rgba(236, 72, 153, 0.28) 38%,
    transparent 70%);
}
```

### 5.3 — Sistema de Views (SPA)

```css
/* ========== VIEWS / SPA ========== */
.view-container {
  display: none;
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.view-container.active {
  display: flex;
}

/* Views de dashboard (sidebar + content) travam o scroll no body */
.view-container.dashboard-view.active {
  height: 100vh;
  min-height: unset;
  overflow: hidden;
}
```

### 5.4 — Login Card

```css
/* ========== LOGIN / TELA PÚBLICA ========== */
.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: transparent;
  position: relative;
  overflow: hidden;
}

/* IMPORTANTE: Sem backdrop-filter. Fundo semi-opaco fixo. */
.login-card {
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 40px 32px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(237, 237, 240, 0.96);
}

html.dark-mode .login-card {
  background: rgba(31, 31, 35, 0.97);
}

.login-logo {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.login-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-light);
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 28px;
  line-height: 1.5;
}

.login-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.form-error {
  margin-top: 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 13px;
}

html.dark-mode .form-error {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
  color: #fca5a5;
}
```

### 5.5 — Botões

```css
/* ========== BOTÕES ========== */
.btn {
  padding: 11px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease,
              border-color 0.2s ease, box-shadow 0.2s ease;
  border: none;
  letter-spacing: 0.2px;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

/* Primary: escuro → hover vira azul accent */
.btn-primary {
  background: var(--text-light);
  color: #fff;
}
.btn-primary:hover { background: var(--accent); color: #fff; }
html.dark-mode .btn-primary { background: var(--text-dark); color: #000; }
html.dark-mode .btn-primary:hover { background: var(--accent); color: #fff; }

/* Outline */
.btn-outline {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-light);
}
.btn-outline:hover {
  background: var(--surface-light);
  border-color: var(--accent);
  color: var(--accent);
}

/* Modificadores */
.btn-small  { padding: 8px 14px; font-size: 12px; }
.btn-full   { width: 100%; margin-top: 8px; }

/* Danger */
.btn-danger { color: #dc2626; border-color: rgba(220, 38, 38, 0.3); }
.btn-danger:hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: #dc2626;
  color: #dc2626;
}

/* Ghost */
.btn-ghost { background: transparent; border-color: transparent; color: var(--muted); }
.btn-ghost:hover { background: var(--border-light); color: var(--text-light); border-color: transparent; }

/* Link */
.btn-link {
  background: none; border: none;
  color: var(--muted); font-size: 13px;
  cursor: pointer; font-family: inherit;
  transition: color 0.2s;
}
.btn-link:hover { color: var(--accent); }

/* Focus ring global */
.btn:focus { outline: none; box-shadow: 0 0 0 2px rgba(17, 27, 217, 0.3); }
```

### 5.6 — Formulários

```css
/* ========== FORMULÁRIOS ========== */
.form-group { margin-bottom: 16px; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-light);
  letter-spacing: 0.2px;
}

.form-group .required { color: var(--accent); }

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--surface-light);
  color: var(--text-light);
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--muted); }

/* Focus: borda accent + ring azul translúcido */
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-light);
  box-shadow: inset 0 0 0 1px var(--accent), 0 0 0 3px rgba(17, 27, 217, 0.1);
}

.form-group textarea { resize: vertical; min-height: 80px; }

/* Select com seta customizada */
.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237c7c85' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}
```

### 5.7 — Cards

```css
/* ========== CARDS ========== */

/* Card padrão de superfície */
.card {
  background: var(--surface-light);
  border: 1.5px solid var(--border-light);
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

html:not(.dark-mode) .card {
  background: #ffffff;
  border-color: #dae0f3;
  box-shadow: 0 6px 28px rgba(50, 60, 130, 0.12);
}

/* Card interativo com hover */
.card--interactive {
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s;
  cursor: pointer;
}
.card--interactive:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
  border-color: var(--accent);
}
.card--interactive:active { transform: scale(0.97); }

/* Card de item com faixa lateral colorida por status */
.item-card {
  background: var(--surface-light);
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s;
}

.item-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  border-radius: 12px 0 0 12px;
}

/* Cores da faixa lateral por status */
.item-card.status-done::before        { background: var(--done); }
.item-card.status-in-progress::before { background: var(--in-progress); }
.item-card.status-planned::before     { background: var(--planned); }
.item-card.status-fix::before         { background: var(--fix); }

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--accent);
}

/* Cards de estatística (grid 4 colunas) */
.stat-card {
  background: var(--surface-light);
  border: 1.5px solid var(--border-light);
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
}

html:not(.dark-mode) .stat-card {
  background: #ffffff;
  border-color: #dae0f3;
  box-shadow: 0 4px 20px rgba(50, 60, 130, 0.09);
}

.stat-icon   { font-size: 26px; margin-bottom: 12px; }
.stat-number { font-size: 40px; font-weight: 800; color: var(--text-light); line-height: 1; letter-spacing: -1px; }
.stat-label  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 7px; }
```

### 5.8 — Badges e Status

```css
/* ========== BADGES ========== */

/* Badge padrão */
.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Tipo/categoria — neutro */
.badge-type { background: #e8eaf4; color: var(--text-light); border: 1px solid #cdd1e8; }
html.dark-mode .badge-type { background: rgba(255,255,255,0.07); border-color: var(--border-light); }

/* Status coloridos */
.badge-status             { color: white; }
.badge-em-andamento       { background: var(--in-progress); }
.badge-concluido          { background: var(--done); color: #000; }
.badge-pausado            { background: var(--muted); }
.badge-planejado          { background: var(--planned); }

/* Pill pequeno */
.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

/* Badge de produto no header — identifica o serviço atual */
.product-badge {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  background: rgba(17, 27, 217, 0.08);
  padding: 4px 10px;
  border-radius: 4px;
}

/* Badge de prazo */
.badge-deadline {
  background: rgba(99, 102, 241, 0.12);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

html.dark-mode .badge-deadline { background: rgba(99,102,241,0.18); color: #a5b4fc; }
```

### 5.9 — Barra de Progresso

```css
/* ========== BARRA DE PROGRESSO ========== */
.progress-section { margin-bottom: 24px; }

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label { font-size: 13px; font-weight: 600; color: var(--text-light); }
.progress-value { font-size: 14px; font-weight: 700; color: var(--accent); }

.progress-bar {
  height: 10px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* 100% completo → vira verde de sucesso */
.progress-fill.complete { background: var(--success); }
```

### 5.10 — Filtros por Status (Pills)

```css
/* ========== FILTROS ========== */
.status-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  border: 1.5px solid var(--border-light);
  background: transparent;
  color: var(--muted);
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.18s, background-color 0.18s, border-color 0.18s, box-shadow 0.18s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(17, 27, 217, 0.05);
}

.filter-btn.active {
  background: var(--text-light);
  color: #fff;
  border-color: var(--text-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

html.dark-mode .filter-btn.active {
  background: var(--text-dark);
  color: #000;
  border-color: var(--text-dark);
}
```

### 5.11 — Modal

```css
/* ========== MODAL ========== */
/* REGRA: Sem backdrop-filter no overlay. Jamais. */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-overlay.active {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  background: var(--bg-light);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-light);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 36px;
  position: relative;
  will-change: transform, opacity;
  transform: translateZ(0);
  contain: layout style;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateZ(0) translateY(12px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}

.modal-title {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
  color: var(--text-light);
}

.modal-close {
  position: absolute;
  top: 16px; right: 16px;
  background: transparent;
  border: none;
  border-radius: 5px;
  width: 28px; height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--muted);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.modal-close:hover { background: var(--surface-light); color: var(--text-light); }

.modal-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 24px;
}

/* Seletor visual de status dentro de modal */
.status-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.status-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 14px 10px;
  border-radius: 12px;
  border: 2px solid var(--border-light);
  background: var(--surface-light);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.12s;
}

.status-opt:hover { transform: translateY(-2px); border-color: var(--muted); }
.status-opt-icon  { font-size: 24px; line-height: 1; }
.status-opt-label { font-size: 12px; font-weight: 500; color: var(--muted); transition: color 0.15s; }

.status-opt--planejado.active  { border-color: #059669; background: rgba(5,150,105,0.07); }
.status-opt--planejado.active .status-opt-label,
.status-opt--planejado .status-opt-icon { color: #059669; }

.status-opt--andamento.active  { border-color: #3b82f6; background: rgba(59,130,246,0.07); }
.status-opt--andamento.active .status-opt-label,
.status-opt--andamento .status-opt-icon { color: #3b82f6; }

.status-opt--concluido.active  { border-color: #10b981; background: rgba(16,185,129,0.07); }
.status-opt--concluido.active .status-opt-label,
.status-opt--concluido .status-opt-icon { color: #10b981; }

.status-opt--corrigir.active   { border-color: #f59e0b; background: rgba(245,158,11,0.07); }
.status-opt--corrigir.active .status-opt-label,
.status-opt--corrigir .status-opt-icon { color: #f59e0b; }
```

### 5.12 — Header

```css
/* ========== HEADER ========== */
/* REGRA: Fundo SEMPRE sólido no sticky header. Nunca translúcido. */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid var(--border-light);
  background-color: var(--bg-light);
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: var(--text-light);
}

.header-controls { display: flex; gap: 16px; align-items: center; }

/* Logo no header — só aparece em mobile */
.header-mobile-logo {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 0;
  line-height: 1;
}

.header-mobile-logo .sidebar-logo     { font-size: 20px; line-height: 1.1; }
.header-mobile-logo .sidebar-logo-sub { font-size: 9px; margin-top: -2px; letter-spacing: 3px; }

/* Toggle de tema */
.theme-toggle {
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-light);
}

.theme-toggle:hover { background: var(--surface-dark); color: #fff; }

/* Badge de contagem no header */
.stat-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-light);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
```

### 5.13 — Sidebar

```css
/* ========== SIDEBAR ========== */
.sidebar {
  width: 280px;
  background: var(--bg-alpha);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  z-index: 50;
}

/* Gradiente decorativo no rodapé da sidebar */
.sidebar::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 160px;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.18), rgba(6,182,212,0.08) 50%, transparent 72%),
    radial-gradient(ellipse at 90% 60%, rgba(249,115,22,0.12), rgba(236,72,153,0.06) 50%, transparent 72%);
  filter: blur(45px);
  pointer-events: none;
  z-index: 0;
  transform: translateZ(0);
}

html.dark-mode .sidebar::after {
  background:
    radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.25), rgba(6,182,212,0.12) 50%, transparent 72%),
    radial-gradient(ellipse at 90% 60%, rgba(249,115,22,0.18), rgba(236,72,153,0.08) 50%, transparent 72%);
}

.sidebar-header {
  padding: 28px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* Nome "NovoWeb" em grande */
.sidebar-logo {
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0px;
  color: var(--text-light);
}

/* Nome do serviço abaixo — SEMPRE em --accent (azul) */
.sidebar-logo-sub {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-top: -15px;
}

.sidebar-top {
  padding: 20px 20px 0;
  flex-shrink: 0;
}

/* Área scrollável */
.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
}

.sidebar-scroll::-webkit-scrollbar        { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-track  { background: transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb  { background: var(--border-light); border-radius: 4px; }

/* Rodapé fixo */
.sidebar-bottom {
  flex-shrink: 0;
  padding: 16px 20px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.sidebar-section-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Items de navegação */
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; }

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  text-align: left;
  width: 100%;
}

.sidebar-nav-item i { font-size: 14px; width: 18px; text-align: center; }

.sidebar-nav-item:hover  { background: var(--surface-light); color: var(--text-light); border-color: var(--border-light); }
.sidebar-nav-item.active { background: var(--surface-light); color: var(--text-light); border-color: var(--accent); font-weight: 600; }

/* Badge de destaque no nav (ex: "IA", "Novo") */
.nav-badge {
  margin-left: auto;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--accent), #6366f1);
  color: #fff;
}

.sidebar-actions-inline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

/* Itens de lista na sidebar (ex: relatórios, projetos) */
.sidebar-list-item {
  padding: 12px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.sidebar-list-item:hover      { border-color: var(--accent); }
.sidebar-list-item.active     { border-color: var(--accent); background: rgba(17,27,217,0.04); }
html.dark-mode .sidebar-list-item.active { background: rgba(17,27,217,0.12); }
```

### 5.14 — Main Content e Container

```css
/* ========== MAIN CONTENT ========== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  will-change: scroll-position;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 36px 40px;
}

/* Grids de conteúdo */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

### 5.15 — Animações

```css
/* ========== ANIMAÇÕES ========== */
/* REGRA: Anime APENAS transform e opacity. Nunca width/height/top/left. */

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateZ(0) translateY(10px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateZ(0) translateY(12px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateZ(0) translateY(20px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}
```

### 5.16 — Toast de Sucesso

```css
/* ========== TOAST DE SUCESSO ========== */
.success-message {
  display: none;
  position: fixed;
  bottom: 24px; right: 24px;
  background: var(--success);
  color: #000;
  padding: 14px 22px;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(3, 250, 110, 0.2);
  font-weight: 600;
  font-size: 13px;
  z-index: 1001;
  animation: slideInUp 0.25s ease;
  align-items: center;
  gap: 8px;
}

.success-message.active { display: flex; }
```

### 5.17 — Scrollbar Global

```css
/* ========== SCROLLBAR ========== */
::-webkit-scrollbar       { width: 8px; }
::-webkit-scrollbar-track { background: var(--surface-light); }
::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
```

### 5.18 — Footer

```css
/* ========== FOOTER ========== */
.footer {
  margin-top: auto;
  padding: 20px 0;
  border-top: 1px solid var(--border-light);
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.3px;
}
```

### 5.19 — Responsividade Obrigatória

```css
/* ========== RESPONSIVIDADE ========== */

/* Tablet */
@media (max-width: 1024px) {
  .sidebar   { width: 260px; }
  .container { padding: 32px 24px; }
  .header    { padding: 0 24px; }
  .grid-4    { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile — sidebar vira barra de navegação inferior */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0; left: 0; right: 0; top: auto;
    border-right: none;
    border-top: 1px solid var(--border-light);
    background: var(--bg-alpha);
    /* EXCEÇÃO: backdrop-filter PERMITIDO apenas na bottom nav mobile (elemento fixo, não animado) */
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    flex-direction: row;
    z-index: 100;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.10);
  }

  .sidebar-header,
  .sidebar-top,
  .sidebar-scroll { display: none; }

  .sidebar::after { display: none; }

  .sidebar-bottom {
    width: 100%;
    padding: 8px 16px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
    border-top: none;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .sidebar-nav {
    flex-direction: row;
    flex: 1;
    gap: 2px;
  }

  .sidebar-nav-item {
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    padding: 8px 4px;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    width: auto;
    border: none;
  }

  .sidebar-nav-item i                    { font-size: 18px; width: auto; }
  .sidebar-nav-item .nav-badge           { display: none; }
  .sidebar-actions-inline .btn-text      { display: none; }
  .sidebar-actions-inline .btn {
    width: 42px; height: 42px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .main-content       { padding-bottom: 72px; }
  .stat-badge         { display: none; }
  .header-controls .btn-text { display: none; }
  .header-mobile-logo { display: flex; }
  .header-title       { display: none; }

  .header, .report-header { padding: 0 16px; height: 54px; }
  .container, .report-content { padding: 24px 16px; }

  .modal         { padding: 24px; margin: 16px; max-width: calc(100vw - 32px); }
  .modal-buttons { grid-template-columns: 1fr; }
  .login-card    { padding: 32px 24px; }
  .grid-4, .grid-2 { grid-template-columns: 1fr; }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .modal      { padding: 16px; margin: 8px; }
  .btn        { font-size: 13px; padding: 10px 14px; }
  .login-card { padding: 24px 16px; }
}

@media (max-width: 360px) {
  .login-card { padding: 24px 16px; }
  .btn        { font-size: 12px; padding: 8px 12px; }
}
```

---

## 6. HTML Completo do Body — Boilerplate

Este é o esqueleto de qualquer serviço NovoWeb. Substitua os comentários `<!-- ... -->` e os textos entre colchetes:

```html
<body>

  <!-- BLOBS: sempre primeiro no body, nunca remova -->
  <div class="bg-blobs" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="blob blob-4"></div>
  </div>

  <!-- ====== VIEW: LOGIN ====== -->
  <div id="loginView" class="view-container active">
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">NovoWeb</div>
        <h2 class="login-title">[Título do serviço]</h2>
        <p class="login-subtitle">[Descrição curta para o usuário]</p>

        <div class="form-group">
          <label>E-mail <span class="required">*</span></label>
          <input type="email" id="emailInput" placeholder="email@exemplo.com" />
        </div>

        <div class="form-group">
          <label>Senha <span class="required">*</span></label>
          <input type="password" id="passwordInput" placeholder="Sua senha" />
        </div>

        <button class="btn btn-primary btn-full" id="loginBtn">
          <i class="fa-solid fa-right-from-bracket"></i>
          Entrar
        </button>

        <div id="loginError" class="form-error hidden"></div>
      </div>
    </div>
  </div>

  <!-- ====== VIEW: DASHBOARD (sidebar + conteúdo) ====== -->
  <div id="dashboardView" class="view-container dashboard-view">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-wrap">
          <div class="sidebar-logo">NovoWeb</div>
          <span class="sidebar-logo-sub">[NOME DO SERVIÇO]</span>
        </div>
      </div>

      <div class="sidebar-top">
        <div class="sidebar-section-title">
          <i class="fa-solid fa-[icone]"></i>
          [Seção principal]
        </div>
      </div>

      <div class="sidebar-scroll" id="sidebarList">
        <!-- Lista de itens dinâmicos (populada por JS) -->
      </div>

      <div class="sidebar-bottom">
        <div class="sidebar-nav">
          <button class="sidebar-nav-item active" data-page="home">
            <i class="fa-solid fa-house"></i>
            <span>Início</span>
          </button>
          <!-- Adicione mais itens de nav conforme necessário -->
        </div>
        <div class="sidebar-actions-inline">
          <button class="btn btn-primary btn-small" id="newItemBtn">
            <i class="fa-solid fa-plus"></i>
            <span class="btn-text">Novo Item</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <header class="header">
        <!-- Logo mobile (só aparece em telas pequenas) -->
        <div class="header-mobile-logo">
          <div class="sidebar-logo">NovoWeb</div>
          <span class="sidebar-logo-sub">[NOME DO SERVIÇO]</span>
        </div>

        <div class="header-title" id="headerTitle">Painel</div>

        <div class="header-controls">
          <button class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
            <i id="themeIcon" class="fa-solid fa-moon"></i>
          </button>
          <button class="btn btn-outline btn-small" id="logoutBtn">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span class="btn-text">Sair</span>
          </button>
        </div>
      </header>

      <div class="container" id="mainContainer">
        <!-- Conteúdo das páginas vai aqui (populado por JS) -->
      </div>
    </div>
  </div>

  <!-- ====== TOAST DE SUCESSO (global, fora das views) ====== -->
  <div class="success-message" id="successMessage">
    <i class="fa-solid fa-circle-check"></i>
    <span id="successText">Salvo com sucesso!</span>
  </div>

  <!-- ====== MODAL DE CONFIRMAÇÃO GENÉRICO (global, fora das views) ====== -->
  <div class="modal-overlay" id="confirmModalOverlay">
    <div class="modal" style="max-width: 360px; text-align: center;">
      <h3 class="modal-title" id="confirmModalTitle">Confirmar ação</h3>
      <p id="confirmModalText" style="color: var(--muted); font-size: 14px; margin-bottom: 8px;"></p>
      <div class="modal-buttons">
        <button class="btn btn-outline" id="confirmModalCancelBtn">Cancelar</button>
        <button class="btn btn-outline btn-danger" id="confirmModalOkBtn">Excluir</button>
      </div>
    </div>
  </div>

  <!-- ====== OUTROS MODAIS FICAM AQUI, FORA DAS VIEWS ====== -->

  <script src="notifications.js"></script>
  <!-- Se usar app.js separado: <script src="app.js"></script> -->
  <!-- Se usar script inline: <script> ... </script> -->
</body>
```

---

## 7. JavaScript Base Obrigatório

Todo serviço deve ter pelo menos estas funções. Organize sempre nesta ordem dentro do `<script>` (ou `app.js`):

```javascript
// ═══════════════════════════════════════════════════════
// 1. FIREBASE CONFIG
// ═══════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "COLE_AQUI",
  authDomain:        "COLE_AQUI",
  projectId:         "COLE_AQUI",
  storageBucket:     "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId:             "COLE_AQUI",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ═══════════════════════════════════════════════════════
// 2. ESTADO GLOBAL
// ═══════════════════════════════════════════════════════
let currentItemId    = null;
let currentItem      = null;
let items            = [];
let currentFilter    = "all";
let isAdmin          = false;
let unsubscribeItems = null;
let _debounceTimer   = null;
let _confirmCallback = null;
let _successTimer    = null;

// ═══════════════════════════════════════════════════════
// 3. TEMA
// ═══════════════════════════════════════════════════════
(function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark-mode");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = "fa-solid fa-sun";
  }
})();

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const icon = document.getElementById("themeIcon");
  if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);

// ═══════════════════════════════════════════════════════
// 4. SISTEMA DE VIEWS (SPA)
// ═══════════════════════════════════════════════════════
function showView(viewId) {
  document.querySelectorAll(".view-container").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId)?.classList.add("active");
}

// ═══════════════════════════════════════════════════════
// 5. MODAIS
// ═══════════════════════════════════════════════════════
function openModal(overlayId) {
  document.getElementById(overlayId)?.classList.add("active");
}

function closeModal(overlayId) {
  document.getElementById(overlayId)?.classList.remove("active");
}

// Fecha ao clicar fora (no overlay escuro)
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", function(e) {
    if (e.target === this) this.classList.remove("active");
  });
});

// Fecha com Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach(o => o.classList.remove("active"));
  }
});

// Modal de confirmação genérico
function openConfirmModal(title, text, onConfirm, confirmLabel = "Excluir") {
  document.getElementById("confirmModalTitle").textContent = title;
  document.getElementById("confirmModalText").textContent  = text;
  document.getElementById("confirmModalOkBtn").textContent = confirmLabel;
  _confirmCallback = onConfirm;
  openModal("confirmModalOverlay");
}

document.getElementById("confirmModalOkBtn")?.addEventListener("click", () => {
  closeModal("confirmModalOverlay");
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
});

document.getElementById("confirmModalCancelBtn")?.addEventListener("click", () => {
  closeModal("confirmModalOverlay");
  _confirmCallback = null;
});

// ═══════════════════════════════════════════════════════
// 6. FEEDBACK AO USUÁRIO
// ═══════════════════════════════════════════════════════
function showSuccess(msg = "Salvo com sucesso!") {
  const el = document.getElementById("successMessage");
  const tx = document.getElementById("successText");
  if (!el) return;
  if (tx) tx.textContent = msg;
  clearTimeout(_successTimer);
  el.classList.add("active");
  _successTimer = setTimeout(() => el.classList.remove("active"), 3000);
}

function showFormError(elementId, msg) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 5000);
}

function setButtonLoading(btn, isLoading, label = "Salvar") {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Aguarde...'
    : label;
}

// ═══════════════════════════════════════════════════════
// 7. SEGURANÇA — SANITIZAÇÃO OBRIGATÓRIA
// ═══════════════════════════════════════════════════════
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ═══════════════════════════════════════════════════════
// 8. AUTENTICAÇÃO (simples — ajuste conforme o serviço)
// ═══════════════════════════════════════════════════════
// NUNCA use senha em texto puro. Use base64 como ofuscação mínima.
// Para gerar: btoa("SuaSenha") no console do browser
const ADMIN_PASSWORD = atob("BASE64_DA_SENHA_AQUI");

function adminLogin() {
  const email = document.getElementById("emailInput").value.trim();
  const pass  = document.getElementById("passwordInput").value;

  if (!email || !pass) {
    showFormError("loginError", "Preencha todos os campos.");
    return;
  }
  if (pass !== ADMIN_PASSWORD) {
    showFormError("loginError", "Credenciais inválidas.");
    return;
  }

  sessionStorage.setItem("adminLogged", "true");
  enterDashboard();
}

function checkSavedSession() {
  if (sessionStorage.getItem("adminLogged") === "true") {
    enterDashboard();
  }
}

function adminLogout() {
  sessionStorage.removeItem("adminLogged");
  if (unsubscribeItems) { unsubscribeItems(); unsubscribeItems = null; }
  showView("loginView");
}

function enterDashboard() {
  showView("dashboardView");
  startListening();
}

// ═══════════════════════════════════════════════════════
// 9. FIREBASE — LISTENER REAL-TIME
// ═══════════════════════════════════════════════════════
function startListening() {
  if (unsubscribeItems) unsubscribeItems();

  unsubscribeItems = db.collection("itens")
    .orderBy("createdAt", "desc")
    .onSnapshot((snap) => {
      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(() => {
        items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderSidebarList(items);
        // Se houver item selecionado, re-renderiza o detalhe
        if (currentItemId) {
          currentItem = items.find(i => i.id === currentItemId) || null;
          if (currentItem) renderDetail(currentItem);
        }
      }, 300); // debounce 300ms
    });
}

// ═══════════════════════════════════════════════════════
// 10. FIREBASE — CRUD
// ═══════════════════════════════════════════════════════
async function saveNewItem(data) {
  const btn = document.getElementById("saveBtn");
  setButtonLoading(btn, true);
  try {
    await db.collection("itens").add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    closeModal("itemModalOverlay");
    showSuccess("Item criado com sucesso!");
  } catch (err) {
    console.error(err);
    showToast("Erro ao salvar. Tente novamente.");
  } finally {
    setButtonLoading(btn, false, '<i class="fa-solid fa-check"></i> Salvar');
  }
}

async function updateItem(id, changes) {
  try {
    await db.collection("itens").doc(id).update({
      ...changes,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    showSuccess("Atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    showToast("Erro ao atualizar.");
  }
}

async function deleteItem(id) {
  try {
    await db.collection("itens").doc(id).delete();
    currentItemId = null;
    currentItem   = null;
    showSuccess("Item excluído.");
  } catch (err) {
    console.error(err);
    showToast("Erro ao excluir.");
  }
}

// ═══════════════════════════════════════════════════════
// 11. RENDERIZAÇÃO (adapte conforme o serviço)
// ═══════════════════════════════════════════════════════
function renderSidebarList(list) {
  const container = document.getElementById("sidebarList");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--muted); font-size: 13px;">
        Nenhum item encontrado
      </div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="sidebar-list-item ${item.id === currentItemId ? 'active' : ''}"
         onclick="selectItem('${escHtml(item.id)}')">
      <div style="font-size: 13px; font-weight: 600; color: var(--text-light);">
        ${escHtml(item.name)}
      </div>
    </div>
  `).join("");
}

function selectItem(id) {
  currentItemId = id;
  currentItem   = items.find(i => i.id === id) || null;
  if (currentItem) renderDetail(currentItem);
  renderSidebarList(items); // atualiza .active na sidebar
}

function renderDetail(item) {
  // Implemente conforme a necessidade do serviço
  const container = document.getElementById("mainContainer");
  if (!container) return;
  container.innerHTML = `
    <h1 style="font-size: 24px; font-weight: 700;">${escHtml(item.name)}</h1>
    <!-- resto do detalhe -->
  `;
}

// ═══════════════════════════════════════════════════════
// 12. INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  checkSavedSession();
  bindGlobalEvents();
});

function bindGlobalEvents() {
  document.getElementById("loginBtn")?.addEventListener("click", adminLogin);
  document.getElementById("logoutBtn")?.addEventListener("click", adminLogout);
  document.getElementById("passwordInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") adminLogin();
  });
}
```

---

## 8. notifications.js

Copie este arquivo inteiro em todo novo serviço:

```javascript
/*
  notifications.js — NovoWeb
  Toast genérico reutilizável em todos os serviços.
  Uso: showToast("Mensagem aqui!");
*/
(function () {
  window.showToast = function (msg, duration) {
    duration = duration || 3500;
    const toast = document.createElement("div");
    toast.style.cssText = [
      "position:fixed",
      "left:50%",
      "transform:translateX(-50%) translateY(20px)",
      "bottom:20px",
      "background:var(--surface-light,#ededf0)",
      "color:var(--text-light,#1a1a1a)",
      "padding:12px 20px",
      "border-radius:8px",
      "box-shadow:0 8px 24px rgba(0,0,0,0.15)",
      "opacity:0",
      "transition:opacity 0.25s,transform 0.25s",
      "z-index:1300",
      "font-family:'Inter',sans-serif",
      "font-size:13px",
      "font-weight:500",
      "max-width:90vw",
      "text-align:center",
    ].join(";");
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  };
})();
```

---

## 9. Firebase — Configuração Padrão

### firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

### firestore.rules (base mínima — ajuste conforme o serviço)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{docId} {
      allow read, write: if true; // Substitua por regras reais antes do deploy em produção
    }
  }
}
```

---

## 10. Tipografia — Escala Completa

| Elemento | Tamanho | Peso | CSS extra |
|---|---|---|---|
| Logo "NovoWeb" | `32–36px` | `600–700` | `letter-spacing: -0.5px` a `0px` |
| Nome do serviço (sub-logo) | `13px` | `600` | `letter-spacing: 3px; text-transform: uppercase; color: var(--accent)` |
| Título de página (h1) | `24–26px` | `600–700` | `letter-spacing: -0.4px` |
| Título de seção | `20–22px` | `500` | `letter-spacing: -0.3px` |
| Item em destaque | `30px` | `700` | `letter-spacing: -0.5px` |
| Corpo de texto | `14px` | `400–500` | — |
| Texto auxiliar/meta | `13px` | `400–600` | `color: var(--muted)` |
| Tags/labels | `11–12px` | `600–700` | `text-transform: uppercase; letter-spacing: 0.1em` |
| Número em destaque (stat) | `36–40px` | `800` | `letter-spacing: -1px; line-height: 1` |

---

## 11. Paleta de Cores — Tokens e Significado

| Token | Valor | Quando usar |
|---|---|---|
| `--accent` | `#111bd9` | Foco de inputs, links ativos, hover de botão primary, nome do serviço, ícones de seção, badges de módulo, valores de progresso |
| `--success` / `--done` | `#03fa6e` | Progresso 100%, status concluído, toast de sucesso |
| `--in-progress` | `#3b82f6` | Status "em andamento" |
| `--planned` | `#059669` | Status "planejado" |
| `--fix` | `#f59e0b` | Atenção, corrigir, pendente |
| `--muted` | `#848484` | Texto secundário, placeholders, datas, metadata |
| `--text-light` | `#1a1a1a` / `#f2f2f2` dark | Todo texto principal |
| `--border-light` | `#d8dcea` / `#2e2e33` dark | Bordas de todos os componentes |
| `--surface-light` | `#ffffff` / `#1f1f23` dark | Fundo de cards, inputs, modais |
| `--bg-light` | `#f0f2f8` / `#0f0f10` dark | Fundo da página, header, container |
| `--bg-alpha` | `rgba(255,255,255,0.9)` | Sidebar e painéis translúcidos sobre os blobs |

> **Regra de ouro:** Nunca use hexadecimais diretamente nos componentes. Sempre passe pelo token. Isso garante que o dark mode funciona automaticamente em todo o serviço.

---

## 12. Dark Mode

O dark mode é ativado adicionando a classe `dark-mode` ao elemento `<html>`. Todas as variáveis sobrescrevem o tema claro automaticamente (veja seção 5.1).

### Comportamento esperado

- Detecta preferência do sistema na primeira visita (`prefers-color-scheme: dark`)
- Salvo em `localStorage` com a chave `"theme"`
- Ícone: lua `fa-moon` (modo claro) → sol `fa-sun` (modo escuro)
- Função `toggleTheme()` já está na seção 7

---

## 13. Background Blobs (Identidade Visual)

Os blobs são o elemento mais característico da identidade NovoWeb. São gradientes radiais abstratos fixos que criam profundidade sem pesar na performance.

**HTML (copie exatamente, sempre o primeiro elemento dentro do `<body>`):**

```html
<div class="bg-blobs" aria-hidden="true">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
  <div class="blob blob-4"></div>
</div>
```

O CSS dos blobs está na seção 5.2. Nunca remova nem reposicione os blobs.

> **Regra:** Nunca adicione `filter: blur()` diretamente em `.blob` ou `.bg-blobs`. A suavidade vem exclusivamente dos `radial-gradient` com `transparent`. Blur em elemento fixed/animado força re-rasterização a 60fps.

---

## 14. Espaçamento e Grid

Use múltiplos de 4px como base:

| Referência | Valor | Uso típico |
|---|---|---|
| `xs` | `4px` | Gap interno entre ícone e texto |
| `sm` | `8px` | Gap entre elementos próximos |
| `md` | `12–16px` | Padding de cards pequenos, gap de grids |
| `lg` | `20–24px` | Padding de seções, margin-bottom entre blocos |
| `xl` | `28–36px` | Padding de cards grandes |
| `2xl` | `40px` | Padding horizontal de headers/containers |

---

## 15. Componentes — Botões

O CSS completo está na seção 5.5. Exemplos de uso:

```html
<!-- Primário -->
<button class="btn btn-primary">
  <i class="fa-solid fa-plus"></i> Novo Item
</button>

<!-- Outline pequeno -->
<button class="btn btn-outline btn-small">
  <i class="fa-solid fa-pen"></i> Editar
</button>

<!-- Danger (exclusão) -->
<button class="btn btn-outline btn-danger btn-small">
  <i class="fa-solid fa-trash"></i> Excluir
</button>

<!-- Largura total -->
<button class="btn btn-primary btn-full">Confirmar</button>
```

---

## 16. Componentes — Formulários

O CSS completo está na seção 5.6. Exemplo de uso:

```html
<div class="form-group">
  <label>Nome do Cliente <span class="required">*</span></label>
  <input type="text" id="nomeInput" placeholder="Ex: João Silva" />
</div>

<div class="form-group">
  <label>Status</label>
  <select id="statusSelect">
    <option value="planejado">Planejado</option>
    <option value="em-andamento">Em andamento</option>
    <option value="concluido">Concluído</option>
  </select>
</div>

<div class="form-group">
  <label>Observações</label>
  <textarea placeholder="Detalhes adicionais..."></textarea>
</div>
```

---

## 17. Componentes — Cards

O CSS completo está na seção 5.7. Use `.card` para painéis genéricos, `.item-card` para itens de lista com status colorido na lateral, e `.stat-card` para números em destaque.

```html
<!-- Item card com status -->
<div class="item-card status-in-progress">
  <div>Nome do item</div>
</div>

<!-- Stat card -->
<div class="stat-card">
  <div class="stat-icon">📦</div>
  <div class="stat-number">42</div>
  <div class="stat-label">Total de Itens</div>
</div>
```

---

## 18. Componentes — Badges e Status

O CSS completo está na seção 5.8.

```html
<!-- Badge de tipo/categoria -->
<span class="badge badge-type">Frontend</span>

<!-- Badge de status colorido -->
<span class="badge badge-status badge-em-andamento">Em andamento</span>
<span class="badge badge-status badge-concluido">Concluído</span>

<!-- Badge de produto no header -->
<span class="product-badge">VISO</span>

<!-- Badge de prazo -->
<span class="badge-deadline">
  <i class="fa-regular fa-calendar"></i> 15/04/2026
</span>
```

---

## 19. Componentes — Barra de Progresso

O CSS completo está na seção 5.9.

```html
<div class="progress-section">
  <div class="progress-header">
    <span class="progress-label">Progresso Geral</span>
    <span class="progress-value" id="progressValue">72%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill" style="width: 72%"></div>
  </div>
</div>
```

```javascript
function setProgressBar(pct) {
  const fill  = document.getElementById("progressFill");
  const value = document.getElementById("progressValue");
  if (fill) {
    fill.style.width = `${pct}%`;
    fill.classList.toggle("complete", pct >= 100);
  }
  if (value) value.textContent = `${pct}%`;
}
```

### Anel SVG de Progresso

Para dashboards de resumo. Circunferência = 2π × 50 ≈ **314**.

```html
<svg class="resumo-ring" viewBox="0 0 120 120" style="width:120px;height:120px;transform:rotate(-90deg);">
  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" stroke-width="10"/>
  <circle id="resumoRingFill" cx="60" cy="60" r="50" fill="none"
          stroke="var(--accent)" stroke-width="10"
          stroke-dasharray="314" stroke-dashoffset="314"
          stroke-linecap="round"
          style="transition: stroke-dashoffset 0.6s ease;"/>
</svg>
```

```javascript
function updateProgressRing(done, total) {
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
  const offset = 314 - (314 * pct) / 100;
  const ring   = document.getElementById("resumoRingFill");
  if (ring) ring.style.strokeDashoffset = offset;
}
```

---

## 20. Componentes — Filtros por Status

O CSS completo está na seção 5.10.

```html
<div class="status-filters" id="taskFilters">
  <button class="filter-btn active" data-filter="all">
    <i class="fa-solid fa-list"></i> Todas
  </button>
  <button class="filter-btn" data-filter="planejado">
    <i class="fa-solid fa-clipboard-list"></i> Planejado
  </button>
  <button class="filter-btn" data-filter="em-andamento">
    <i class="fa-solid fa-spinner"></i> Em Andamento
  </button>
  <button class="filter-btn" data-filter="concluido">
    <i class="fa-solid fa-circle-check"></i> Concluído
  </button>
</div>
```

```javascript
// Bind via delegação de eventos (eficiente)
document.getElementById("taskFilters")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  renderFiltered();
});
```

---

## 21. Componentes — Modal / Overlay

O CSS completo está na seção 5.11. O modal de confirmação genérico já está no boilerplate do body (seção 6).

```html
<!-- Modal personalizado (exemplo) -->
<div class="modal-overlay" id="itemModalOverlay">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('itemModalOverlay')">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <h3 class="modal-title">Novo Item</h3>

    <div class="form-group">
      <label>Nome <span class="required">*</span></label>
      <input type="text" id="itemNameInput" placeholder="Nome do item" />
    </div>

    <div class="modal-buttons">
      <button class="btn btn-outline" onclick="closeModal('itemModalOverlay')">Cancelar</button>
      <button class="btn btn-primary" id="saveBtn">
        <i class="fa-solid fa-check"></i> Salvar
      </button>
    </div>
  </div>
</div>
```

---

## 22. Componentes — Header

O CSS completo está na seção 5.12.

```html
<header class="header">
  <!-- Logo mobile (exibido apenas em ≤768px) -->
  <div class="header-mobile-logo">
    <div class="sidebar-logo">NovoWeb</div>
    <span class="sidebar-logo-sub">VISO</span>
  </div>

  <!-- Título da página atual (atualizado por JS) -->
  <div class="header-title" id="headerTitle">Painel</div>

  <!-- Controles do lado direito -->
  <div class="header-controls">
    <span class="product-badge">VISO</span>
    <button class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
      <i id="themeIcon" class="fa-solid fa-moon"></i>
    </button>
    <button class="btn btn-outline btn-small" id="logoutBtn">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span class="btn-text">Sair</span>
    </button>
  </div>
</header>
```

---

## 23. Componentes — Sidebar

O CSS completo está na seção 5.13. A estrutura HTML completa está no boilerplate da seção 6.

---

## 24. Animações e Transições

### Regras

| Permitido | Proibido |
|---|---|
| `transform: translate/scale/rotate` | `width`, `height` (causa layout reflow) |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `background-color`, `color`, `border-color` | `filter` em elementos fixed/animados |
| `box-shadow` (com moderação) | `backdrop-filter` em overlays animados |

### Durations padrão

| Tipo | Duração |
|---|---|
| Hover rápido (cor, borda) | `0.15–0.2s ease` |
| Entrada de elemento (card, modal) | `0.2s ease` |
| Progress bar fill | `0.6s ease` |
| Tema (background global) | `0.3s ease` |

---

## 25. Responsividade Obrigatória

O CSS completo está na seção 5.19. Resumo do comportamento esperado:

| Breakpoint | Comportamento |
|---|---|
| `>1024px` | Layout padrão desktop — sidebar visível, grids 4 colunas |
| `≤1024px` (tablet) | Sidebar 260px, grids 2 colunas, container com menos padding |
| `≤768px` (mobile) | Sidebar vira bottom nav, título do header some, logo aparece no header, botões só têm ícone |
| `≤480px` | Modal, botão e login card com menos padding |

---

## 26. Performance — Regras de Ouro

1. **`backdrop-filter` está banido** em overlays, sidebars desktop e login cards. Force fundo semi-opaco no lugar.
2. **`filter: blur()`** só em elementos **estáticos** (sem animação, sem `position: fixed` que receba scroll).
3. **`will-change`** apenas em elementos realmente animados pelo JS (modais, scroll containers). Nunca em todos os cards.
4. **`contain: layout style`** em modais e componentes isolados.
5. **Font Awesome** com `media="print" onload="this.media='all'"` — nunca bloqueante.
6. **`overscroll-behavior: none`** no `body` e nos scroll containers internos.
7. **`transform: translateZ(0)`** apenas nas animações `@keyframes`, não como hack global.
8. **Debounce obrigatório** (≥300ms) em qualquer função chamada pelo `onSnapshot`.

---

## 27. Arquitetura JavaScript — Estado e Estrutura

### Ordem obrigatória dentro do `<script>`

```
1. Firebase config + inicialização
2. Variáveis de estado global (let ...)
3. Tema (IIFE que roda imediatamente)
4. showView(), openModal(), closeModal()
5. showSuccess(), showFormError(), setButtonLoading()
6. escHtml() — sanitização
7. Autenticação (adminLogin, checkSavedSession, adminLogout)
8. Firebase listeners (startListening, stopListening)
9. Firebase CRUD (saveNew, update, delete)
10. Renderização (renderList, renderDetail, buildCardHTML)
11. Filtros e navegação interna
12. Inicialização (DOMContentLoaded + bindGlobalEvents)
```

### Por que debounce no onSnapshot?

O Firestore dispara `onSnapshot` para cada mudança individual, inclusive as que o próprio app fez. Sem debounce, salvar um item causa um re-render que pisca a UI. Use 300ms como mínimo.

---

## 28. Sistema de Views (SPA)

### Estrutura HTML

```html
<!-- A primeira view visível ao carregar deve ter .active -->
<div id="loginView"     class="view-container active">...</div>
<div id="dashboardView" class="view-container dashboard-view">...</div>
<div id="clientView"    class="view-container">...</div>
```

### JavaScript

```javascript
function showView(viewId) {
  document.querySelectorAll(".view-container").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId)?.classList.add("active");
}
```

### Roteamento por Hash (opcional — para links diretos)

```javascript
function handleRoute() {
  const hash = window.location.hash; // ex: "#item=A1B2C3"
  if (hash.startsWith("#item=")) {
    const code = hash.split("=")[1];
    if (code) {
      accessByCode(code);
      return;
    }
  }
  showView("loginView");
}

window.addEventListener("hashchange", handleRoute);
handleRoute(); // executa ao carregar
```

---

## 29. Autenticação

### Admin simples (sem Firebase Auth)

```javascript
// NUNCA use a senha em texto puro.
// Para gerar: btoa("SuaSenha") no console → use o resultado abaixo
const ADMIN_PASSWORD = atob("BASE64_AQUI");

function adminLogin() {
  const email = document.getElementById("emailInput").value.trim();
  const pass  = document.getElementById("passwordInput").value;
  if (!email || !pass) { showFormError("loginError", "Preencha todos os campos."); return; }
  if (pass !== ADMIN_PASSWORD) { showFormError("loginError", "Credenciais inválidas."); return; }
  sessionStorage.setItem("adminLogged", "true");
  enterDashboard();
}

function checkSavedSession() {
  if (sessionStorage.getItem("adminLogged") === "true") enterDashboard();
}

function adminLogout() {
  sessionStorage.removeItem("adminLogged");
  if (unsubscribeItems) { unsubscribeItems(); unsubscribeItems = null; }
  showView("loginView");
}
```

### Acesso de cliente por código

```javascript
async function accessByCode(code) {
  if (!code) return;
  const snap = await db.collection("itens")
    .where("accessCode", "==", code.toUpperCase())
    .limit(1)
    .get();

  if (snap.empty) {
    showFormError("codeError", "Código não encontrado.");
    return;
  }

  currentItemId = snap.docs[0].id;
  currentItem   = { id: currentItemId, ...snap.docs[0].data() };
  renderDetail(currentItem);
  showView("clientView");
}
```

---

## 30. Firebase — Padrões CRUD

### Estrutura de documento (Firestore)

```javascript
// Ao criar:
const docData = {
  name:       "Nome do item",
  status:     "planejado",
  // ... outros campos específicos do serviço ...
  accessCode: await generateUniqueAccessCode(),
  createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt:  firebase.firestore.FieldValue.serverTimestamp(),
};
await db.collection("itens").add(docData);

// Ao atualizar:
await db.collection("itens").doc(id).update({
  name: novoNome,
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
```

### Geração de código de acesso único

```javascript
function generateAccessCode(length = 6) {
  // Sem I, O, 0, 1 — caracteres confusos visualmente
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function generateUniqueAccessCode() {
  let code, exists;
  do {
    code = generateAccessCode();
    const snap = await db.collection("itens").where("accessCode", "==", code).limit(1).get();
    exists = !snap.empty;
  } while (exists);
  return code;
}
```

---

## 31. Renderização Dinâmica e Feedback

### Sanitização — obrigatória para qualquer dado do Firestore

```javascript
// Esta função é obrigatória em todo serviço NovoWeb
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ✅ CORRETO:
card.innerHTML = `<span>${escHtml(item.name)}</span>`;

// ❌ ERRADO (nunca):
card.innerHTML = `<span>${item.name}</span>`;
```

### Estado de carregamento em botões

```javascript
// Antes de operação assíncrona:
btn.disabled = true;
btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

// Após:
btn.disabled = false;
btn.innerHTML = '<i class="fa-solid fa-check"></i> Salvar';
```

### Função genérica de setButtonLoading

```javascript
function setButtonLoading(btn, isLoading, label = "Salvar") {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Aguarde...'
    : label;
}
```

---

## 32. Navegação na Sidebar

### HTML (sub-páginas internas do dashboard)

```html
<div class="sidebar-nav">
  <button class="sidebar-nav-item active" data-page="main">
    <i class="fa-solid fa-house"></i>
    <span>Início</span>
  </button>
  <button class="sidebar-nav-item" data-page="resumo">
    <i class="fa-solid fa-chart-bar"></i>
    <span>Resumo</span>
  </button>
</div>
```

### JavaScript

```javascript
const PAGES = {
  main:   document.getElementById("mainPage"),
  resumo: document.getElementById("resumoPage"),
  // adicione conforme necessário
};

function showPage(pageId) {
  Object.values(PAGES).forEach(p => { if (p) p.style.display = "none"; });
  if (PAGES[pageId]) PAGES[pageId].style.display = "";

  document.querySelectorAll(".sidebar-nav-item").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.sidebar-nav-item[data-page="${pageId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const headerTitle = document.getElementById("headerTitle");
  const titles = { main: "Painel", resumo: "Resumo" };
  if (headerTitle) headerTitle.textContent = titles[pageId] || "";
}

// Bind via delegação
document.querySelector(".sidebar-nav")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".sidebar-nav-item");
  if (btn?.dataset.page) showPage(btn.dataset.page);
});
```

---

## 33. Dropzone (Drag & Drop)

### HTML

```html
<div class="dropzone" id="dropZone">
  <div class="dropzone-content">
    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 32px; color: var(--muted);"></i>
    <p style="margin-top: 12px; color: var(--muted);">Arraste um arquivo aqui ou</p>
    <label for="fileInput" class="btn btn-outline btn-small" style="cursor: pointer; margin-top: 8px;">
      Selecionar arquivo
    </label>
    <input type="file" id="fileInput" accept=".json,.csv,.txt" style="display: none;" />
  </div>
</div>
```

### CSS

```css
.dropzone {
  border: 2px dashed var(--border-light);
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.dropzone.drag-over {
  border-color: var(--accent);
  background: rgba(17, 27, 217, 0.04);
}
```

### JavaScript

```javascript
function initDropzone() {
  const zone  = document.getElementById("dropZone");
  const input = document.getElementById("fileInput");
  if (!zone) return;

  zone.addEventListener("dragover",  (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", ()  => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  });

  input?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  });
}

function processFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Processe os dados conforme necessidade do serviço
    } catch {
      showToast("Arquivo inválido.");
    }
  };
  reader.readAsText(file, "UTF-8");
}
```

---

## 34. Progresso — Barra e Anel SVG

### Barra de progresso

```javascript
function updateProgressBar(tasks) {
  if (!tasks || tasks.length === 0) {
    setProgressBar(0);
    return;
  }
  const done = tasks.filter(t => t.status === "concluido").length;
  setProgressBar(Math.round((done / tasks.length) * 100));
}

function setProgressBar(pct) {
  const fill  = document.getElementById("progressFill");
  const value = document.getElementById("progressValue");
  if (fill) {
    fill.style.width = `${pct}%`;
    fill.classList.toggle("complete", pct >= 100);
  }
  if (value) value.textContent = `${pct}%`;
}
```

### Anel SVG

O anel usa `stroke-dashoffset` para animar. Circunferência = 2π × r = 2π × 50 ≈ **314**.

```html
<div style="position: relative; display: inline-flex; align-items: center; justify-content: center;">
  <svg viewBox="0 0 120 120" style="width: 120px; height: 120px; transform: rotate(-90deg);">
    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" stroke-width="10"/>
    <circle id="resumoRingFill" cx="60" cy="60" r="50" fill="none"
            stroke="var(--accent)" stroke-width="10"
            stroke-dasharray="314" stroke-dashoffset="314"
            stroke-linecap="round"
            style="transition: stroke-dashoffset 0.6s ease;"/>
  </svg>
  <div style="position: absolute; text-align: center;">
    <span id="resumoRingPct" style="font-size: 22px; font-weight: 800; color: var(--text-light);">0%</span>
    <span style="display: block; font-size: 11px; color: var(--muted);">concluídas</span>
  </div>
</div>
```

```javascript
function updateProgressRing(done, total) {
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
  const offset = 314 - (314 * pct) / 100;
  const ring   = document.getElementById("resumoRingFill");
  const label  = document.getElementById("resumoRingPct");
  if (ring) ring.style.strokeDashoffset = offset;
  if (label) label.textContent = `${pct}%`;
}
```

---

## 35. Cloud Functions

Use Cloud Functions para operações que não devem rodar no browser (envio de email, webhooks, etc.):

### functions/index.js

```javascript
const functions = require("firebase-functions");
const admin     = require("firebase-admin");
admin.initializeApp();

// Trigger: novo documento criado
exports.onItemCreated = functions.firestore
  .document("itens/{itemId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    // Ex: enviar email de notificação
    console.log("Novo item criado:", data.name);
  });
```

### functions/package.json

```json
{
  "name": "novoweb-[servico]-functions",
  "engines": { "node": "18" },
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0"
  }
}
```

---

## 36. Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| IDs no HTML | camelCase | `projectNameInput`, `saveReportBtn` |
| Classes CSS | kebab-case | `item-card`, `status-done` |
| Funções JS | camelCase, verbo primeiro | `renderList()`, `saveItem()`, `showView()` |
| Variáveis JS | camelCase | `currentItemId`, `allTasks` |
| Constantes JS | UPPER_SNAKE_CASE | `ADMIN_PASSWORD`, `MAX_RETRIES` |
| Coleções Firestore | camelCase plural | `relatorios`, `projetos`, `tarefas` |
| Campos Firestore | camelCase | `projectName`, `createdAt`, `accessCode` |
| IDs de Views | `[nome]View` | `loginView`, `dashboardView` |
| IDs de Modais | `[nome]ModalOverlay` | `taskModalOverlay`, `confirmModalOverlay` |
| IDs de Páginas internas | `[nome]Page` | `resumoPage`, `importPage` |

---

## 37. Segurança

### Sanitização de saída (obrigatória)

```javascript
// Esta função deve estar em TODO serviço NovoWeb
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
```

### Dados sensíveis

```javascript
// ❌ NUNCA:
const PASS = "minhasenha123";

// ✅ Use base64 como ofuscação mínima (não é criptografia — serve para projetos internos simples)
const PASS = atob("bWluaGFzZW5oYTEyMw==");

// ✅ Credenciais de API nunca vão no front-end — use Cloud Functions
```

### Regras do Firestore

Configure sempre as `firestore.rules` antes de ir para produção. Nunca deixe `allow read, write: if true` em produção sem validação.

---

## 38. Como Nomear o Serviço na Interface

```html
<!-- Na sidebar (desktop) -->
<div class="sidebar-logo-wrap">
  <div class="sidebar-logo">NovoWeb</div>
  <span class="sidebar-logo-sub">VISO</span>  <!-- maiúsculas -->
</div>

<!-- No header do cliente / tela pública -->
<div class="sidebar-logo">NovoWeb</div>
<span class="product-badge">Viso</span>

<!-- No <title> da página -->
<title>NovoWeb — Viso</title>

<!-- No footer -->
<footer class="footer">© 2026 NovoWeb — Viso</footer>
```

---

## 39. Padrões de Comportamento Esperados

### Dark Mode
- Ativado pela classe `html.dark-mode`
- Detecta `prefers-color-scheme` na primeira visita
- Salvo em `localStorage["theme"]`
- Ícone: `fa-moon` → claro / `fa-sun` → escuro

### Navegação (SPA)
- Todas as "páginas" são `.view-container` recebendo/perdendo `.active`
- Nunca recarregar a página para navegar
- URL com hash é opcional (use apenas se precisar de links diretos)

### Feedback ao Usuário
- Toda **ação destrutiva** (deletar) exige confirmação em modal (`openConfirmModal`)
- Toda **operação assíncrona** (salvar, buscar) mostra estado de loading no botão via `setButtonLoading`
- Toda **ação bem-sucedida** mostra `showSuccess()` (verde neon) ou `showToast()` (neutro)
- **Erros** aparecem em `.form-error` (dentro de forms) ou `showToast()` (global)

### Responsividade
- Sidebar vira **barra de navegação inferior** em mobile (≤768px)
- `.btn-text` some em mobile — fica só ícone
- Título do header some em mobile — logo aparece no lugar
- Grids de 4 colunas → 2 no tablet → 1 no mobile

---

## 40. Checklist Final Antes de Entregar

### Identidade Visual
- [ ] Logo "NovoWeb" presente em todas as telas
- [ ] Nome do serviço em `--accent` abaixo do logo (`.sidebar-logo-sub`)
- [ ] Badge do produto no header (`.product-badge`)
- [ ] 4 blobs no início do `<body>` com `aria-hidden="true"`
- [ ] Fonte Inter importada do Google Fonts
- [ ] Font Awesome carregado com `media="print" onload`

### Design e CSS
- [ ] Nenhuma cor hexadecimal fora das variáveis no `:root`
- [ ] Dark mode funcionando em todos os componentes
- [ ] Toggle de tema salvo no `localStorage`
- [ ] Zero `backdrop-filter` (exceto sidebar mobile — permitido)
- [ ] Nenhuma animação em `width`, `height`, `top`, `left`
- [ ] Login card com `max-width: 420px` e fundo semi-opaco

### Estrutura e Código
- [ ] SPA com `.view-container` + classe `.active`
- [ ] `notifications.js` incluído e `showToast()` disponível
- [ ] Funções `showView()`, `openModal()`, `closeModal()`, `showSuccess()` disponíveis
- [ ] `escHtml()` usada em todo dado do Firestore inserido no DOM
- [ ] `overscroll-behavior: none` no body
- [ ] `<title>` no formato `NovoWeb — [Nome do Serviço]`

### JavaScript e Firebase
- [ ] Firebase inicializado antes de qualquer função
- [ ] Variáveis de estado global declaradas no topo
- [ ] Debounce (≥300ms) no `onSnapshot`
- [ ] `unsubscribeItems` chamado ao sair da view/dashboard
- [ ] Ações destrutivas com `openConfirmModal` antes de executar

### Firebase e Deploy
- [ ] `firebase.json` com rewrite `** → /index.html`
- [ ] `firestore.rules` com regras adequadas (não `if true` em produção)
- [ ] `.firebaserc` apontando para o projeto correto
- [ ] `favicon/site.webmanifest` com nome do serviço

---

## 41. Exemplo de Prompt para a IA

Quando quiser criar um novo serviço NovoWeb, use este prompt:

```
Você é um desenvolvedor front-end sênior da NovoWeb.

Crie um novo serviço chamado "[NOME DO SERVIÇO]" seguindo RIGOROSAMENTE o
NOVOWEB_MANUAL_COMPLETO.md. Não invente nada que não esteja no manual.

O serviço faz o seguinte:
[DESCREVA O QUE O SERVIÇO FAZ EM 2-3 FRASES]

Views necessárias:
- [Ex: login admin, dashboard admin, tela do cliente]

Funcionalidades principais:
- [Liste as funcionalidades específicas deste serviço]

Coleção Firestore:
- Nome: [ex: relatorios, projetos, ordens]
- Campos: [liste os campos que cada documento deve ter]

Use Firebase Firestore para o banco de dados.
Use a estrutura de arquivos: index.html + design.css + notifications.js

[COLE AQUI O CONTEÚDO COMPLETO DO NOVOWEB_MANUAL_COMPLETO.md]
```

---

*NovoWeb — Manual Completo para IA. Versão 2.0 — Março de 2026.*
*Unifica: NOVOWEB_IA_MANUAL, NOVOWEB_DESIGN_SYSTEM e NOVOWEB_ESTRUTURA_MANUAL.*
*Aplica-se a todos os serviços: Viso, TIME, e qualquer produto futuro da NovoWeb.*
