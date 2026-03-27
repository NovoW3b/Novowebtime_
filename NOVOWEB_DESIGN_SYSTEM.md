# NovoWeb — Design System

> Guia completo de design, componentes e padrões visuais para todos os serviços e produtos da NovoWeb.  
> Este documento é a fonte de verdade para qualquer novo projeto ou feature. Siga rigorosamente para manter a identidade da marca consistente.

---

## Sumário

1. [Princípios de Design](#1-princípios-de-design)
2. [Tipografia](#2-tipografia)
3. [Paleta de Cores e Tokens CSS](#3-paleta-de-cores-e-tokens-css)
4. [Dark Mode](#4-dark-mode)
5. [Background com Blobs (Identidade Visual)](#5-background-com-blobs-identidade-visual)
6. [Espaçamento e Grid](#6-espaçamento-e-grid)
7. [Componentes — Botões](#7-componentes--botões)
8. [Componentes — Formulários](#8-componentes--formulários)
9. [Componentes — Cards](#9-componentes--cards)
10. [Componentes — Badges e Chips de Status](#10-componentes--badges-e-chips-de-status)
11. [Componentes — Barra de Progresso](#11-componentes--barra-de-progresso)
12. [Componentes — Filtros por Status](#12-componentes--filtros-por-status)
13. [Componentes — Modal / Overlay](#13-componentes--modal--overlay)
14. [Componentes — Toast / Notificação Temporária](#14-componentes--toast--notificação-temporária)
15. [Componentes — Header](#15-componentes--header)
16. [Componentes — Sidebar](#16-componentes--sidebar)
17. [Layout de Views (SPA)](#17-layout-de-views-spa)
18. [Layout de Login / Tela Pública](#18-layout-de-login--tela-pública)
19. [Animações e Transições](#19-animações-e-transições)
20. [Responsividade](#20-responsividade)
21. [Performance — Regras de Ouro](#21-performance--regras-de-ouro)
22. [Estrutura de Arquivos Recomendada](#22-estrutura-de-arquivos-recomendada)
23. [Checklist de Novo Projeto](#23-checklist-de-novo-projeto)

---

## 1. Princípios de Design

| Princípio | Descrição |
|---|---|
| **Consistência** | Todos os produtos NovoWeb devem parecer feitos pela mesma mão. Nunca reinvente tokens ou componentes já definidos aqui. |
| **Leveza** | Prefira surfaces translúcidas, bordas sutis e sombras suaves. A marca é sofisticada, não pesada. |
| **Performance** | Animações apenas via `transform` e `opacity` (GPU compositing). Jamais anime `width`, `height`, `top`, `left` ou `filter` em elementos visíveis. |
| **Acessibilidade** | Contraste mínimo WCAG AA. Labels em todos os inputs. `aria-label` em botões só com ícone. |
| **Dark Mode nativo** | Todo componente deve contemplar dark mode. Use exclusivamente as variáveis CSS — nunca cores hardcoded. |

---

## 2. Tipografia

### Fonte Principal

```
Inter (Google Fonts)
Pesos: 300, 400, 500, 600, 700
```

**Import no `<head>`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**CSS Base:**
```css
body {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
}
```

### Escala Tipográfica

| Uso | Tamanho | Peso | Observação |
|---|---|---|---|
| Logo/Brand | `32–36px` | `600–700` | `letter-spacing: -0.5px` ou `0px` |
| Título de Página (h1) | `24px` | `500` | `letter-spacing: -0.3px` |
| Título de Seção (h2) | `20px` | `500` | — |
| Nome de item destaque | `30px` | `700` | `letter-spacing: -0.5px` |
| Corpo / Label | `14px` | `400–500` | — |
| Texto auxiliar | `13px` | `400–600` | Cor `var(--muted)` |
| Meta / Tags | `11–12px` | `600–700` | `text-transform: uppercase; letter-spacing: 0.1em` |
| Número de destaque | `40px` | `800` | `letter-spacing: -1px; line-height: 1` |

---

## 3. Paleta de Cores e Tokens CSS

Todos os projetos NovoWeb devem importar (ou reproduzir) este bloco de variáveis no `:root`:

```css
:root {
  /* ── Identidade ── */
  --primary:        #0d0d0d;
  --secondary:      #1a1a1a;
  --accent:         #111bd9;   /* Azul NovoWeb — cor de marca */
  --success:        #03fa6e;   /* Verde neon — 100% completo */

  /* ── Backgrounds ── */
  --bg-light:       #f0f2f8;
  --bg-dark:        #141414;
  --bg-alpha:       rgba(255, 255, 255, 0.9); /* Painéis sobre blobs */

  /* ── Surfaces (cards, modais, inputs) ── */
  --surface-light:  #ffffff;
  --surface-dark:   #1f1f1f;

  /* ── Texto ── */
  --text-light:     #1a1a1a;
  --text-dark:      #f2f2f2;
  --muted:          #848484;   /* Labels, placeholders, metadata */

  /* ── Bordas ── */
  --border-light:   #d8dcea;
  --border-dark:    #3a3a3a;

  /* ── Status de Tarefas / Fluxos ── */
  --planned:        #059669;   /* Verde escuro — planejado */
  --in-progress:    #3b82f6;   /* Azul — em andamento */
  --done:           #03fa6e;   /* Verde neon — concluído */
  --fix:            #f59e0b;   /* Âmbar — corrigir/atenção */

  color-scheme: light;
}
```

### Uso dos Tokens

- **`--accent`** → foco de inputs, links ativos, botão primary no hover, badges de marca, valores de progresso.
- **`--success` / `--done`** → itens 100% concluídos, progresso completo.
- **`--muted`** → nunca use para conteúdo principal. Apenas metadados, datas, hints.
- **Nunca** use cores hexadecimais diretamente nos componentes. Sempre passe pelo token.

---

## 4. Dark Mode

O dark mode é ativado adicionando a classe `dark-mode` ao elemento `<html>`.  
As variáveis sobrescrevem automaticamente o tema claro.

```css
html.dark-mode {
  --primary:      #0f0f10;
  --secondary:    #1a1a1d;

  --bg-light:     #0f0f10;
  --bg-dark:      #1a1a1d;
  --bg-alpha:     rgba(15, 15, 16, 0.82);

  --surface-light: #1f1f23;
  --surface-dark:  #2a2a2f;

  --text-light:   #f2f2f2;
  --text-dark:    #c8c8c8;

  --border-light: #2e2e33;
  --border-dark:  #3a3a40;

  color-scheme: dark;
}
```

### Toggle de Tema (JavaScript)

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  // Atualizar ícone:
  document.getElementById("themeIcon").className =
    isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// Inicializar na carga da página:
(function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark-mode");
  }
})();
```

### Botão de Toggle (HTML)

```html
<button class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
  <i id="themeIcon" class="fa-solid fa-moon"></i>
</button>
```

---

## 5. Background com Blobs (Identidade Visual)

Os "blobs" são o elemento mais característico da identidade NovoWeb. São gradientes radiais abstratos fixos no fundo que criam profundidade sem pesar na performance.

### HTML (copie exatamente, sempre no início do `<body>`)

```html
<div class="bg-blobs" aria-hidden="true">
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
  <div class="blob blob-4"></div>
</div>
```

### CSS

```css
.bg-blobs {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  /* Sem filter:blur no container — evita rasterização extra */
}

.blob {
  position: absolute;
  border-radius: 50%;
}

/* Blob 1 — laranja/vermelho (superior-esquerdo) */
.blob-1 {
  width: clamp(600px, 70vw, 900px);
  height: clamp(560px, 65vw, 860px);
  top: -25%;
  left: -20%;
  background: radial-gradient(ellipse at 40% 40%,
    rgba(245, 166, 35, 0.55) 0%,
    rgba(239, 68, 68, 0.30) 35%,
    transparent 70%);
}

/* Blob 2 — azul/ciano (superior-direito) */
.blob-2 {
  width: clamp(560px, 65vw, 860px);
  height: clamp(520px, 60vw, 820px);
  top: -20%;
  right: -18%;
  background: radial-gradient(ellipse at 55% 40%,
    rgba(59, 130, 246, 0.52) 0%,
    rgba(6, 182, 212, 0.22) 40%,
    transparent 70%);
}

/* Blob 3 — índigo/azul (inferior-esquerdo) */
.blob-3 {
  width: clamp(540px, 62vw, 840px);
  height: clamp(500px, 58vw, 800px);
  bottom: -20%;
  left: -15%;
  background: radial-gradient(ellipse at 45% 55%,
    rgba(99, 102, 241, 0.50) 0%,
    rgba(59, 130, 246, 0.24) 40%,
    transparent 70%);
}

/* Blob 4 — rosa/laranja (inferior-direito) */
.blob-4 {
  width: clamp(580px, 68vw, 880px);
  height: clamp(540px, 63vw, 840px);
  bottom: -18%;
  right: -15%;
  background: radial-gradient(ellipse at 55% 55%,
    rgba(249, 115, 22, 0.52) 0%,
    rgba(236, 72, 153, 0.28) 38%,
    transparent 70%);
}
```

> **Regra:** Nunca adicione `filter: blur()` diretamente em `.blob` ou `.bg-blobs`. A suavidade vem exclusivamente dos `radial-gradient` com `transparent`. Blur em elemento fixed/animado força re-rasterização a 60fps.

---

## 6. Espaçamento e Grid

### Escala de Espaçamento

Use múltiplos de 4px como base:

| Token (referência) | Valor | Uso típico |
|---|---|---|
| `xs` | `4px` | gap interno entre ícone e texto |
| `sm` | `8px` | gap entre elementos próximos |
| `md` | `12–16px` | padding de cards pequenos, gap de grids |
| `lg` | `20–24px` | padding de seções, margin-bottom entre blocos |
| `xl` | `28–36px` | padding de cards grandes, padding de containers |
| `2xl` | `40px` | padding horizontal de headers/containers |

### Grid de Cards

```css
/* 4 colunas — summary cards, stat cards */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* 2 colunas — editor, formulários duplos */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

---

## 7. Componentes — Botões

### CSS Completo

```css
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

/* Primary: fundo escuro → hover vira accent */
.btn-primary {
  background: var(--text-light);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent);
  color: #fff;
}
html.dark-mode .btn-primary {
  background: var(--text-dark);
  color: #000;
}
html.dark-mode .btn-primary:hover {
  background: var(--accent);
  color: #fff;
}

/* Outline: transparente com borda */
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

/* Tamanho pequeno */
.btn-small {
  padding: 8px 14px;
  font-size: 12px;
}

/* Largura total */
.btn-full {
  width: 100%;
  margin-top: 8px;
}

/* Danger */
.btn-danger {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.3);
}
.btn-danger:hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: #dc2626;
  color: #dc2626;
}

/* Link simples */
.btn-link {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s;
}
.btn-link:hover {
  color: var(--accent);
}
```

### Exemplos de Uso

```html
<button class="btn btn-primary">
  <i class="fa-solid fa-plus"></i>
  Novo Item
</button>

<button class="btn btn-outline btn-small">
  <i class="fa-solid fa-pen"></i>
  Editar
</button>

<button class="btn btn-outline btn-danger btn-small">
  <i class="fa-solid fa-trash"></i>
  Excluir
</button>

<button class="btn btn-primary btn-full">Confirmar</button>
```

---

## 8. Componentes — Formulários

```css
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-light);
  letter-spacing: 0.2px;
}

.form-group .required {
  color: var(--accent);
}

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
.form-group textarea::placeholder {
  color: var(--muted);
}

/* Focus: borda accent + ring azul translúcido */
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-light);
  box-shadow: inset 0 0 0 1px var(--accent), 0 0 0 3px rgba(17, 27, 217, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Select customizado */
.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237c7c85' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}
```

### Exemplo

```html
<div class="form-group">
  <label>
    Nome do Cliente
    <span class="required">*</span>
  </label>
  <input type="text" placeholder="Ex: João Silva" />
</div>

<div class="form-group">
  <label>Observações</label>
  <textarea placeholder="Detalhes adicionais..."></textarea>
</div>
```

---

## 9. Componentes — Cards

### Card Padrão (Superfície)

```css
.card {
  background: var(--surface-light);
  border: 1.5px solid var(--border-light);
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* Light mode: hierarquia visual mais definida */
html:not(.dark-mode) .card {
  background: #ffffff;
  border-color: #dae0f3;
  box-shadow: 0 6px 28px rgba(50, 60, 130, 0.12);
}
```

### Card com Hover (interativo)

```css
.card--interactive {
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s;
  cursor: pointer;
}

.card--interactive:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
  border-color: var(--accent);
}

.card--interactive:active {
  transform: scale(0.97);
}
```

### Card de Task / Item de Lista

Cards de item possuem um indicador lateral colorido por status:

```css
.task-card {
  background: var(--surface-light);
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s;
}

/* Faixa lateral colorida */
.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 12px 0 0 12px;
}

.task-card.task-concluido::before  { background: var(--done); }
.task-card.task-em-andamento::before { background: var(--in-progress); }
.task-card.task-planejado::before  { background: var(--planned); }
.task-card.task-corrigir::before   { background: var(--fix); }

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--accent);
}
```

**Anatomia interna do task-card:**

```html
<div class="task-card task-em-andamento">
  <div class="task-header">
    <div class="task-status-chip"><!-- ícone de status --></div>
    <div class="task-body">
      <p class="task-title">Nome da Tarefa</p>
      <p class="task-description">Descrição opcional da tarefa.</p>
    </div>
  </div>
  <div class="task-footer">
    <div class="task-meta">
      <span class="task-status-badge">Em andamento</span>
      <span class="task-date"><i class="fa-regular fa-clock"></i> 01/03/2026</span>
    </div>
    <div class="task-actions">
      <!-- botões de ação -->
    </div>
  </div>
</div>
```

---

## 10. Componentes — Badges e Chips de Status

### Badges Gerais

```css
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
.badge-type {
  background: #e8eaf4;
  color: var(--text-light);
  border: 1px solid #cdd1e8;
}
html.dark-mode .badge-type {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--border-light);
}

/* Status — coloridos */
.badge-status        { color: white; }
.badge-em-andamento  { background: var(--in-progress); }
.badge-concluido     { background: var(--done); color: #000; }
.badge-pausado       { background: var(--muted); }
```

### Status Badge (pill — menor)

```css
.task-status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
  white-space: nowrap;
  letter-spacing: 0.01em;
}
```

### Badge de Módulo/Produto (header)

Identifica o produto atual dentro da suite NovoWeb:

```css
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
```

```html
<!-- Ex: no header de qualquer produto -->
<div class="sidebar-logo">NovoWeb</div>
<span class="product-badge">NomeDoProduto</span>
```

---

## 11. Componentes — Barra de Progresso

```css
.progress-section {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
}

.progress-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

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

/* Quando 100% — muda para verde de sucesso */
.progress-fill.complete {
  background: var(--success);
}
```

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

---

## 12. Componentes — Filtros por Status

```css
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

```html
<div class="status-filters">
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

---

## 13. Componentes — Modal / Overlay

```css
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  /* Sem backdrop-filter — evita re-composição de toda a página */
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
  font-size: 20px;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 20px;
  letter-spacing: -0.3px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  border-radius: 5px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  transition: color 0.15s, background 0.15s;
}

.modal-close:hover {
  color: var(--text-light);
  background: var(--border-light);
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}
```

**Abrir/fechar modal (JS):**

```javascript
// Abrir
document.getElementById("meuModal").classList.add("active");

// Fechar
document.getElementById("meuModal").classList.remove("active");

// Fechar ao clicar no overlay
document.getElementById("meuModal").addEventListener("click", function(e) {
  if (e.target === this) this.classList.remove("active");
});
```

---

## 14. Componentes — Toast / Notificação Temporária

Função reutilizável. Cole em `notifications.js` ou equivalente:

```javascript
function showToast(msg, duration = 3500) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    bottom: 20px;
    background: var(--surface-light, #ededf0);
    color: var(--text-light, #1a1a1a);
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    opacity: 0;
    transition: opacity 0.25s, transform 0.25s;
    z-index: 1300;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.parentNode?.removeChild(toast), 300);
  }, duration);
}
```

**Uso:** `showToast("Salvo com sucesso!");`

---

## 15. Componentes — Header

O header é **sticky** no topo com altura fixa de `60px`:

```css
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid var(--border-light);
  background-color: var(--bg-light); /* opaco — sem transparência no sticky */
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

.header-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}
```

> **Importante:** O fundo do header deve ser **sólido** (`var(--bg-light)`, sem alpha), não translúcido. Headers translúcidos sobre o conteúdo que scrolla causam artefatos visuais e forçam re-composição contínua.

---

## 16. Componentes — Sidebar

Apenas para layouts do tipo **dashboard/admin** (produto com área logada):

```css
.sidebar {
  width: 280px;
  background: var(--bg-alpha); /* translúcido para os blobs aparecerem */
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  z-index: 50;
}

.sidebar-header {
  padding: 28px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Identificação do produto abaixo do logo */
.sidebar-logo {
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0px;
  color: var(--text-light);
}

.sidebar-logo-sub {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent); /* sempre azul NovoWeb */
  margin-top: -15px;
}

/* Área scrollável (lista de itens) */
.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.sidebar-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 4px;
}

/* Rodapé fixo com ações */
.sidebar-bottom {
  flex-shrink: 0;
  padding: 16px 20px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Nav items */
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
  width: 100%;
  text-align: left;
}

.sidebar-nav-item:hover {
  background: var(--surface-light);
  color: var(--text-light);
}

.sidebar-nav-item.active {
  background: var(--surface-light);
  color: var(--text-light);
  font-weight: 600;
}
```

### Estrutura HTML da Sidebar

```html
<aside class="sidebar">
  <!-- Logo -->
  <div class="sidebar-header">
    <div class="sidebar-logo-wrap">
      <div class="sidebar-logo">NovoWeb</div>
      <span class="sidebar-logo-sub">NomeDoProduto</span>
    </div>
  </div>

  <!-- Label fixa -->
  <div class="sidebar-top">
    <div class="sidebar-section-title">
      <i class="fa-solid fa-folder-open"></i>
      Seção Principal
    </div>
  </div>

  <!-- Conteúdo scrollável -->
  <div class="sidebar-scroll">
    <!-- itens dinâmicos aqui -->
  </div>

  <!-- Rodapé fixo -->
  <div class="sidebar-bottom">
    <div class="sidebar-nav">
      <button class="sidebar-nav-item active">
        <i class="fa-solid fa-house"></i>
        <span>Início</span>
      </button>
    </div>
    <div class="sidebar-actions-inline">
      <button class="btn btn-primary btn-small">
        <i class="fa-solid fa-plus"></i>
        Novo Item
      </button>
    </div>
  </div>
</aside>
```

---

## 17. Layout de Views (SPA)

Todos os produtos NovoWeb são **Single Page Applications** com troca de views via classe `active`. Nenhuma navegação recarrega a página.

```css
/* Reset geral */
* { margin: 0; padding: 0; box-sizing: border-box; }

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

/* Cada "página" é uma view-container */
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

/* Views do tipo dashboard (sidebar + content) não scrollam no body */
.view-container.dashboard-view.active {
  height: 100vh;
  min-height: unset;
  overflow: hidden;
}
```

**Troca de views (JS):**

```javascript
function showView(viewId) {
  document.querySelectorAll(".view-container").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
}

// Uso:
showView("loginView");
showView("dashboardView");
```

---

## 18. Layout de Login / Tela Pública

Padrão para qualquer tela de acesso (login, código de entrada, landing):

```css
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
  /* Sem backdrop-filter */
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

/* Mensagem de erro */
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

### HTML de Login

```html
<div id="loginView" class="view-container active">
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">NovoWeb</div>
      <h2 class="login-title">Título do Produto</h2>
      <p class="login-subtitle">Descrição curta de contexto para o usuário.</p>

      <div class="form-group">
        <label>E-mail <span class="required">*</span></label>
        <input type="email" placeholder="email@exemplo.com" />
      </div>

      <div class="form-group">
        <label>Senha <span class="required">*</span></label>
        <input type="password" placeholder="Sua senha" />
      </div>

      <button class="btn btn-primary btn-full">
        <i class="fa-solid fa-right-from-bracket"></i>
        Entrar
      </button>

      <div id="loginError" class="form-error hidden"></div>

      <div class="login-footer">
        <button class="btn-link">
          <i class="fa-solid fa-arrow-left"></i>
          Voltar
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 19. Animações e Transições

### Regras

| Permitido | Proibido |
|---|---|
| `transform: translate/scale/rotate` | `width`, `height` (causa layout) |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `background-color`, `color`, `border-color` (UI hover) | `filter` em elementos animated/fixed grandes |
| `box-shadow` (com moderação) | `backdrop-filter` em overlays animados |

### Keyframes Padrão

```css
/* Entrada suave para cards e modais */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateZ(0) translateY(10px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}

/* Entrada para overlay/modal */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Entrada do painel do modal */
@keyframes slideUp {
  from { opacity: 0; transform: translateZ(0) translateY(12px); }
  to   { opacity: 1; transform: translateZ(0) translateY(0); }
}
```

### Durations

| Tipo | Duração |
|---|---|
| Hover rápido (cor, borda) | `0.15–0.2s ease` |
| Entrada de elemento (card, modal) | `0.2s ease` |
| Progress bar fill | `0.6s ease` |
| Tema (background global) | `0.3s ease` |

---

## 20. Responsividade

### Breakpoints

| Nome | Valor | Uso |
|---|---|---|
| `sm` | `600px` | Mobile portrait |
| `md` | `768px` | Mobile landscape / tablet pequeno |
| `lg` | `1100px` | Tablet / desktop pequeno |
| `xl` | `1320px` | Max-width de containers de conteúdo |

### Padrões Mobile

```css
/* Grid de 4 → 2 colunas no tablet */
@media (max-width: 1100px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

/* Grid de 2/4 → 1 coluna no mobile */
@media (max-width: 600px) {
  .grid-4, .grid-2 { grid-template-columns: 1fr; }
}

/* Header: reduzir padding */
@media (max-width: 768px) {
  .header   { padding: 0 20px; }
  .container { padding: 20px; }
}

/* Sidebar vira overlay no mobile */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    transition: left 0.3s ease;
    z-index: 100;
  }
  .sidebar.open { left: 0; }

  .main-content { width: 100%; }

  /* Logo no header mobile substitui sidebar */
  .header-mobile-logo { display: flex; }
}
```

---

## 21. Performance — Regras de Ouro

1. **`backdrop-filter` está banido** em overlays, sidebars e login cards. Force um fundo semi-opaco no lugar.
2. **`filter: blur()`** só pode ser usado em elementos **estáticos** (sem animação, sem posição `fixed` em contexto com scroll).
3. **`will-change`** apenas em elementos realmente animados pelo JS (ex: modais, scroll containers). Nunca em todos os cards.
4. **`contain: layout style paint`** em modais e componentes isolados que não afetam o layout externo.
5. **Imagens**: sempre com `width` e `height` definidos para evitar layout shift (CLS).
6. **Font Awesome**: carregue com `media="print" onload="this.media='all'"` para não bloquear o render.
7. **`overscroll-behavior: none`** no `body` e `contain` nos scroll containers internos.
8. **`transform: translateZ(0)`** apenas nas animações `@keyframes`, não como hack global.

---

## 22. Estrutura de Arquivos Recomendada

```
NomeDoProduto/
├── index.html            ← SPA principal
├── design.css            ← Todo o CSS do produto (tokens + componentes)
├── app.js                ← Lógica principal da aplicação
├── notifications.js      ← Toasts, helpers de notificação
├── firebase.json         ← Config do Firebase Hosting
├── firestore.rules       ← Regras do Firestore
├── .firebaserc           ← Projeto Firebase
├── favicon/
│   ├── favicon.svg
│   ├── favicon.ico
│   └── site.webmanifest
└── functions/            ← Cloud Functions (se necessário)
    ├── index.js
    └── package.json
```

### Convenções

- **Um arquivo CSS** por produto (`design.css`). Não fragmente em múltiplos arquivos para projetos simples.
- **Classes semânticas**, não utilitárias. Nunca use Tailwind ou frameworks CSS externos — a identidade visual da NovoWeb depende de CSS próprio.
- **IDs apenas para JavaScript** (`getElementById`). Classes para estilo.
- **Prefixo de produto** para classes específicas de um produto que não existem no design system (ex: `.viso-kanban`, `.grana-chart`). Componentes genéricos seguem o design system sem prefixo.

---

## 23. Checklist de Novo Projeto

Antes de considerar um projeto "pronto para deploy", marque todos os itens:

### Identidade e CSS
- [ ] Variáveis CSS do `:root` copiadas do design system
- [ ] Dark mode funcional (classe `html.dark-mode`)
- [ ] Toggle de tema implementado e salvo no `localStorage`
- [ ] Blobs no início do `<body>` (`aria-hidden="true"`)
- [ ] Fonte Inter importada do Google Fonts
- [ ] Font Awesome com carregamento não-bloqueante

### Componentes
- [ ] Login card com `max-width: 420px` e fundo semi-opaco (sem `backdrop-filter`)
- [ ] Header sticky com `background-color: var(--bg-light)` opaco
- [ ] Todos os botões usam classes `.btn`, `.btn-primary`, `.btn-outline`
- [ ] Todos os inputs com `:focus` usando `var(--accent)` + ring translúcido
- [ ] Modais sem `backdrop-filter`, com animação `slideUp`
- [ ] Toast de feedback implementado (função `showToast`)
- [ ] `product-badge` no header identificando o nome do produto

### Estrutura e Performance
- [ ] SPA com `.view-container` e troca via `classList`
- [ ] Nenhuma animação em `width`, `height`, `top`, `left`
- [ ] `overscroll-behavior: none` no body
- [ ] Imagens com `width` e `height` definidos (evitar CLS)
- [ ] `favicon/site.webmanifest` preenchido com nome do produto

### Firebase / Deploy
- [ ] `firebase.json` com rewrite `** → /index.html`
- [ ] `firestore.rules` com regras adequadas ao produto
- [ ] `.firebaserc` apontando para o projeto correto
- [ ] `_redirects` (se Netlify) ou `firebase.json` (se Firebase Hosting)

---

*Documento mantido pela equipe NovoWeb. Última atualização: março de 2026.*
