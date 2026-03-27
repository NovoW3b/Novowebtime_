# NovoWeb — Manual de Estrutura para IA

> **Para a IA que vai ler este arquivo:**  
> Este documento define **como qualquer serviço NovoWeb deve ser estruturado em termos de HTML, JavaScript e lógica**. Ele é o complemento do `NOVOWEB_IA_MANUAL.md` (que cobre o CSS/Design). Leia ambos antes de começar a construir.  
> Siga cada padrão descrito aqui **exatamente**, pois todos os serviços NovoWeb devem ter o mesmo comportamento interno.

---

## 1. ARQUITETURA GERAL

Todo serviço NovoWeb é uma **SPA (Single Page Application)** construída sem frameworks:

```
┌─────────────────────────────────────────────────────────┐
│                         index.html                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  <head>: fonts, CSS, Firebase SDK, favicon       │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  <body>                                          │   │
│  │   ├─ .bg-blobs (4 blobs fixos)                  │   │
│  │   ├─ #view1  .view-container.active  ← visível  │   │
│  │   ├─ #view2  .view-container         ← oculto   │   │
│  │   ├─ #view3  .view-container         ← oculto   │   │
│  │   ├─ .modal-overlay (modais globais)            │   │
│  │   ├─ .success-message (toast global)           │   │
│  │   └─ <script> inline (config + toda a lógica)  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Tecnologias:**
- HTML5 + CSS3 + JavaScript puro (ES6+)
- Firebase Firestore (banco de dados em tempo real)
- Firebase Hosting (deploy)
- Firebase Auth (opcional — pode ser senha hardcoded para admins simples)
- Cloud Functions (opcional — para emails/webhooks)

---

## 2. REGRAS ABSOLUTAS DE ESTRUTURA

```
❌ NUNCA use frameworks JS (React, Vue, Angular, Svelte)
❌ NUNCA divida o código em múltiplos arquivos JS sem motivo claro
❌ NUNCA use IDs duplicados no HTML — cada ID é único e global
❌ NUNCA manipule views via CSS display inline — use sempre a classe .active
❌ NUNCA escreva lógica de negócio dentro de event listeners diretos
❌ NUNCA deixe credenciais Firebase no código sem ao menos restringir no Console
❌ NUNCA faça fetch de dados toda vez que uma view é exibida — use listeners
❌ NUNCA crie elementos DOM por `innerHTML` com dados do usuário sem sanitizar

✅ SEMPRE inicialize o Firebase antes de qualquer outra coisa no <script>
✅ SEMPRE use um objeto de estado global (let state = {})
✅ SEMPRE separe a lógica em funções nomeadas e reutilizáveis
✅ SEMPRE use real-time listeners (onSnapshot) para dados que mudam
✅ SEMPRE remova listeners (unsubscribe) ao trocar de view/contexto
✅ SEMPRE sanitize dados do Firestore antes de inserir no DOM
✅ SEMPRE debounce operações que disparam no onSnapshot frequentemente
```

---

## 3. ESTRUTURA DO `<script>` INLINE

Todo o JavaScript vai em um único `<script>` no final do `<body>`, organizado nesta ordem:

```javascript
<script>
  // ── 1. FIREBASE CONFIG ──────────────────────────────────
  const firebaseConfig = { /* ... */ };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ── 2. CONSTANTES E CONFIGURAÇÕES ────────────────────────
  const ADMIN_PASSWORD = atob("BASE64_DA_SENHA"); // nunca a senha direta
  window.ADMIN_PHONE = "55XXXXXXXXXXX";

  // ── 3. ESTADO GLOBAL ────────────────────────────────────
  let currentItemId = null;
  let currentItem = null;
  let items = [];
  let currentFilter = "all";
  let unsubscribeItems = null;    // cleanup de listeners
  let _debounceTimer = null;      // debounce handle

  // ── 4. INICIALIZAÇÃO ─────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    handleRoute();
    window.addEventListener("hashchange", handleRoute);
    checkSavedSession();
    bindGlobalEvents();
  });

  // ── 5. TEMA ──────────────────────────────────────────────
  function initializeTheme() { /* ... */ }
  function toggleTheme(iconId) { /* ... */ }

  // ── 6. ROTEAMENTO E VIEWS ────────────────────────────────
  function handleRoute() { /* ... */ }
  function showView(id) { /* ... */ }

  // ── 7. AUTENTICAÇÃO ──────────────────────────────────────
  function checkSavedSession() { /* ... */ }
  function login() { /* ... */ }
  function logout() { /* ... */ }

  // ── 8. FIREBASE — LEITURA ────────────────────────────────
  function startListening() { /* ... */ }
  function stopListening() { /* ... */ }

  // ── 9. FIREBASE — ESCRITA ────────────────────────────────
  function saveItem() { /* ... */ }
  function deleteItem(id) { /* ... */ }

  // ── 10. RENDERIZAÇÃO ─────────────────────────────────────
  function renderList(items) { /* ... */ }
  function renderDetail(item) { /* ... */ }

  // ── 11. MODAIS ───────────────────────────────────────────
  function openModal(id) { /* ... */ }
  function closeModal(id) { /* ... */ }

  // ── 12. FILTROS E BUSCA ──────────────────────────────────
  function applyFilter(filter) { /* ... */ }

  // ── 13. FEEDBACK AO USUÁRIO ──────────────────────────────
  function showSuccess(msg) { /* ... */ }
  function setButtonLoading(btn, loading, label) { /* ... */ }

  // ── 14. EVENTOS GLOBAIS ──────────────────────────────────
  function bindGlobalEvents() { /* ... */ }
</script>
```

---

## 4. SISTEMA DE VIEWS (SPA)

### 4.1 — Estrutura HTML

Cada "tela" é um `<div>` com `class="view-container"`. Apenas uma tem a classe `active` por vez:

```html
<!-- A primeira view visível ao carregar deve ter .active -->
<div id="loginView"    class="view-container active">...</div>
<div id="dashboardView" class="view-container">...</div>
<div id="reportView"   class="view-container">...</div>
```

Views de dashboard (com sidebar) precisam de uma classe extra para travar o scroll:

```html
<div id="dashboardView" class="view-container dashboard-view">...</div>
```

### 4.2 — Função showView()

```javascript
function showView(viewId) {
  // Remove .active de todas as views
  document.querySelectorAll(".view-container")
    .forEach(v => v.classList.remove("active"));
  // Ativa só a view desejada
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");
}
```

### 4.3 — Roteamento por Hash

Use `window.location.hash` para permitir links diretos. Exemplo do Viso:

```javascript
function handleRoute() {
  const hash = window.location.hash; // ex: "#client=A1B2C3"

  if (hash.startsWith("#client=")) {
    const code = hash.replace("#client=", "").trim().toUpperCase();
    if (code) {
      // Preenche o campo e tenta autenticar automaticamente
      const input = document.getElementById("accessCodeInput");
      if (input) input.value = code;
      accessReport(code); // tenta logar direto
      return;
    }
  }

  // Padrão: exibe tela de login
  showView("loginView");
}
```

---

## 5. ESTADO GLOBAL

### 5.1 — Padrão de Variáveis de Estado

Declare todas as variáveis de estado no topo do `<script>`, antes de qualquer função:

```javascript
// ── ESTADO DO SERVIÇO ──────────────────────────────────────
let currentPageId = null;           // ID do item atual exibido
let currentPage   = null;           // Objeto completo do item atual
let items         = [];             // Cache local dos dados do Firestore
let currentFilter = "all";          // Filtro ativo na lista
let isAdmin       = false;          // Flag de autenticação

// ── LISTENERS FIREBASE (para cleanup) ──────────────────────
let unsubscribeItems  = null;
let unsubscribeCurrent = null;

// ── CONTROLE INTERNO ───────────────────────────────────────
let _debounceTimer    = null;  // Debounce de operações frequentes
let _lastDataHash     = null;  // Evitar re-renders desnecessários
```

### 5.2 — Por que debounce no onSnapshot?

O Firestore dispara `onSnapshot` para cada mudança, inclusive as que o próprio app fez. Sem debounce, salvar um item causa um re-render imediato que pisca a UI:

```javascript
function startListeningToItems() {
  // Cancela listener anterior se existir
  if (unsubscribeItems) unsubscribeItems();

  unsubscribeItems = db.collection("items")
    .orderBy("updatedAt", "desc")
    .onSnapshot((snap) => {
      // Debounce: só processa 300ms após a última mudança
      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(() => {
        items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderList(items);
        updateStats();
      }, 300);
    });
}
```

---

## 6. AUTENTICAÇÃO

### 6.1 — Admin simples (sem Firebase Auth)

Projetos simples usam uma senha em base64 no código e salvam sessão no `sessionStorage`:

```javascript
// NUNCA use a senha em texto puro. Use base64 como ofuscação mínima.
// Para gerar: btoa("MinhaS3nh@") no console do browser
const ADMIN_PASSWORD = atob("BASE64_AQUI");

function adminLogin() {
  const email = document.getElementById("adminEmailInput").value.trim();
  const pass  = document.getElementById("adminPasswordInput").value;

  // Valide email e senha
  if (!email || pass !== ADMIN_PASSWORD) {
    showLoginError("adminLoginError", "Credenciais inválidas.");
    return;
  }

  // Salva sessão
  sessionStorage.setItem("adminLogged", "true");
  sessionStorage.setItem("adminEmail", email);
  isAdmin = true;

  enterAdminDashboard();
}

function checkSavedSession() {
  if (sessionStorage.getItem("adminLogged") === "true") {
    isAdmin = true;
    enterAdminDashboard();
  }
}

function adminLogout() {
  sessionStorage.removeItem("adminLogged");
  sessionStorage.removeItem("adminEmail");
  isAdmin = false;
  if (unsubscribeItems) { unsubscribeItems(); unsubscribeItems = null; }
  showView("adminLoginView");
}
```

### 6.2 — Acesso do cliente (código de acesso)

```javascript
async function accessReport(code) {
  if (!code) return;

  setButtonLoading(document.getElementById("accessBtn"), true, "Verificando...");

  try {
    const snap = await db.collection("relatorios")
      .where("accessCode", "==", code.toUpperCase())
      .limit(1)
      .get();

    if (snap.empty) {
      showAccessError("Código inválido ou não encontrado.");
      return;
    }

    const doc = snap.docs[0];
    clientReport = { id: doc.id, ...doc.data() };

    // Limpa hash da URL após login bem-sucedido
    history.replaceState(null, "", window.location.pathname);

    renderClientReport(clientReport);
    showView("clientReportView");

  } catch (err) {
    console.error(err);
    showAccessError("Erro ao buscar relatório. Tente novamente.");
  } finally {
    setButtonLoading(document.getElementById("accessBtn"), false, "Acessar Relatório");
  }
}
```

---

## 7. FIREBASE — PADRÕES CRUD

### 7.1 — Estrutura de Documento (Firestore)

Todo documento deve ter campos de metadados para rastreamento:

```javascript
// Ao criar:
const docData = {
  // Dados do serviço
  projectName: "Meu Projeto",
  clientName: "João Silva",
  status: "em-andamento",
  tasks: [],

  // Metadados obrigatórios
  createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt:  firebase.firestore.FieldValue.serverTimestamp(),
  accessCode: generateAccessCode(), // código único para o cliente
};

await db.collection("relatorios").add(docData);

// Ao atualizar:
await db.collection("relatorios").doc(id).update({
  projectName: novoNome,
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
```

### 7.2 — Criar documento

```javascript
async function saveNewItem(data) {
  const btn = document.getElementById("saveBtn");
  setButtonLoading(btn, true, "Salvando...");

  try {
    const ref = await db.collection("items").add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    currentItemId = ref.id;
    showSuccess("Item criado com sucesso!");

  } catch (err) {
    console.error("Erro ao salvar:", err);
    showToast("Erro ao salvar. Tente novamente.");
  } finally {
    setButtonLoading(btn, false, "Salvar");
  }
}
```

### 7.3 — Atualizar documento

```javascript
async function updateItem(id, changes) {
  try {
    await db.collection("items").doc(id).update({
      ...changes,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    showSuccess("Alterações salvas!");
  } catch (err) {
    console.error(err);
    showToast("Erro ao atualizar.");
  }
}
```

### 7.4 — Deletar documento (sempre com confirmação)

```javascript
// 1. Usuário clica em deletar → abre modal de confirmação
document.getElementById("deleteBtn").addEventListener("click", () => {
  openConfirmModal(
    "Excluir item?",
    "Esta ação não pode ser desfeita.",
    () => deleteItem(currentItemId) // callback confirmado
  );
});

// 2. Função de deleção efetiva
async function deleteItem(id) {
  try {
    await db.collection("items").doc(id).delete();
    currentItemId = null;
    currentItem = null;
    showView("dashboardView"); // volta para a lista
    showSuccess("Item excluído.");
  } catch (err) {
    console.error(err);
    showToast("Erro ao excluir.");
  }
}
```

### 7.5 — Real-time listener (onSnapshot)

```javascript
function startListening() {
  // Sempre cancele o listener anterior antes de criar um novo
  stopListening();

  unsubscribeItems = db.collection("items")
    .orderBy("updatedAt", "desc")
    .onSnapshot(
      (snap) => {
        clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(() => {
          items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          renderList(items);
        }, 300);
      },
      (err) => {
        console.error("Listener error:", err);
        showToast("Erro de conexão com o banco.");
      }
    );
}

function stopListening() {
  if (unsubscribeItems) {
    unsubscribeItems();
    unsubscribeItems = null;
  }
}
```

### 7.6 — Geração de código de acesso único

```javascript
function generateAccessCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem I, O, 0, 1 (confusos visualmente)
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Para garantir unicidade antes de salvar:
async function generateUniqueAccessCode() {
  let code, exists;
  do {
    code = generateAccessCode();
    const snap = await db.collection("relatorios")
      .where("accessCode", "==", code)
      .limit(1)
      .get();
    exists = !snap.empty;
  } while (exists);
  return code;
}
```

---

## 8. TEMA (DARK MODE)

```javascript
// Inicializa assim que o DOM carrega — antes de qualquer render
function initializeTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark-mode");
    // Atualiza todos os ícones de tema na página
    document.querySelectorAll("[id^='themeIcon']").forEach(icon => {
      icon.className = "fa-solid fa-sun";
    });
  }
}

function toggleTheme(iconElementId) {
  const html   = document.documentElement;
  const isDark = html.classList.toggle("dark-mode");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Atualiza todos os ícones de tema
  document.querySelectorAll("[id^='themeIcon']").forEach(icon => {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  });
}

// Binding dos botões de tema (pode haver um por view)
document.getElementById("themeToggleAdmin")?.addEventListener("click",  () => toggleTheme());
document.getElementById("themeToggleClient")?.addEventListener("click", () => toggleTheme());
```

---

## 9. MODAIS

### 9.1 — Padrão HTML de Modal

```html
<!-- Sempre fora das .view-container, diretamente no <body> -->
<div class="modal-overlay" id="meuModalOverlay">
  <div class="modal">

    <button class="modal-close" id="meuModalClose" aria-label="Fechar">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <h2 class="modal-title">Título do Modal</h2>

    <form id="meuForm">
      <!-- campos -->
      <div class="modal-buttons">
        <button type="button" class="btn btn-outline" id="meuModalCancelBtn">Cancelar</button>
        <button type="submit"  class="btn btn-primary" id="meuModalSubmitBtn">Confirmar</button>
      </div>
    </form>

  </div>
</div>
```

### 9.2 — Funções de Modal

```javascript
function openModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.add("active");
}

function closeModal(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.remove("active");
}

// Fecha ao clicar fora (no overlay escuro)
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("active");
  });
});

// Fecha com Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active")
      .forEach(o => o.classList.remove("active"));
  }
});
```

### 9.3 — Modal de Confirmação Genérico

Reutilize um único modal de confirmação para qualquer ação destrutiva:

```html
<div class="modal-overlay" id="confirmModalOverlay">
  <div class="modal" style="max-width: 360px; text-align: center;">
    <h2 class="modal-title" id="confirmModalTitle">Confirmar ação</h2>
    <p id="confirmModalText" style="color: var(--muted); font-size: 14px; margin-bottom: 24px;"></p>
    <div class="modal-buttons">
      <button class="btn btn-outline"  id="confirmModalCancelBtn">Cancelar</button>
      <button class="btn btn-danger"   id="confirmModalOkBtn">Excluir</button>
    </div>
  </div>
</div>
```

```javascript
let _confirmCallback = null;

function openConfirmModal(title, text, onConfirm, confirmLabel = "Excluir") {
  document.getElementById("confirmModalTitle").textContent = title;
  document.getElementById("confirmModalText").textContent  = text;
  document.getElementById("confirmModalOkBtn").textContent = confirmLabel;
  _confirmCallback = onConfirm;
  openModal("confirmModalOverlay");
}

document.getElementById("confirmModalOkBtn").addEventListener("click", () => {
  closeModal("confirmModalOverlay");
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
});

document.getElementById("confirmModalCancelBtn").addEventListener("click", () => {
  closeModal("confirmModalOverlay");
  _confirmCallback = null;
});
```

---

## 10. RENDERIZAÇÃO DINÂMICA

### 10.1 — Template de Card/Item

Use funções que retornam strings HTML. **NUNCA** insira dados do usuário com interpolação direta — sanitize sempre:

```javascript
// Sanitização obrigatória para qualquer dado que vem do Firestore/usuário
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Função de template para um card de item
function buildItemCardHTML(item) {
  const statusClass = {
    "em-andamento": "status-in-progress",
    "concluido":    "status-done",
    "planejado":    "status-planned",
    "corrigir":     "status-fix",
  }[item.status] || "";

  const statusLabel = {
    "em-andamento": "Em Andamento",
    "concluido":    "Concluído",
    "planejado":    "Planejado",
    "corrigir":     "Corrigir",
  }[item.status] || item.status;

  return `
    <div class="item-card ${statusClass}"
         data-id="${escHtml(item.id)}"
         role="button"
         tabindex="0">
      <div class="item-card-header">
        <span class="item-card-title">${escHtml(item.title)}</span>
        <span class="badge badge-status badge-${escHtml(item.status)}">${statusLabel}</span>
      </div>
      ${item.description
        ? `<p class="item-card-desc">${escHtml(item.description)}</p>`
        : ""}
    </div>
  `;
}
```

### 10.2 — Renderizar lista com empty state

```javascript
function renderList(items) {
  const container = document.getElementById("itemsList");
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-inbox"></i></div>
        <div class="empty-state-text">Nenhum item encontrado</div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(buildItemCardHTML).join("");

  // Attach events APÓS inserir no DOM
  container.querySelectorAll(".item-card").forEach(card => {
    card.addEventListener("click", () => selectItem(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") selectItem(card.dataset.id);
    });
  });
}
```

### 10.3 — Estado de carregamento em botões

```javascript
function setButtonLoading(btn, isLoading, label) {
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn._originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${label || "Aguarde..."}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._originalHTML || label || "OK";
  }
}

// Uso:
async function saveData() {
  const btn = document.getElementById("saveBtn");
  setButtonLoading(btn, true, "Salvando...");
  try {
    await db.collection("items").doc(id).update(data);
    showSuccess("Salvo!");
  } catch (e) {
    showToast("Erro ao salvar.");
  } finally {
    setButtonLoading(btn, false); // restaura automaticamente o HTML original
  }
}
```

---

## 11. FEEDBACK AO USUÁRIO

### 11.1 — Toast de Sucesso (fixo no canto)

HTML (no final do body, fora das views):

```html
<div class="success-message" id="successMessage">
  <i class="fa-solid fa-circle-check"></i>
  <span id="successText">Salvo com sucesso!</span>
</div>
```

JavaScript:

```javascript
let _successTimer = null;

function showSuccess(msg) {
  const el   = document.getElementById("successMessage");
  const text = document.getElementById("successText");
  if (!el) return;

  if (text) text.textContent = msg || "Salvo com sucesso!";

  // Cancela timer anterior (evita piscar se chamado rápido)
  clearTimeout(_successTimer);
  el.classList.add("active");

  _successTimer = setTimeout(() => el.classList.remove("active"), 3000);
}
```

### 11.2 — Toast genérico flutuante (do notifications.js)

```javascript
// Do notifications.js — disponível em toda a aplicação como showTemporaryNotice()
showTemporaryNotice("Código copiado!");
showTemporaryNotice("Link enviado por WhatsApp.");
```

### 11.3 — Erro em campo de formulário

```html
<div id="loginError" class="form-error hidden"></div>
```

```javascript
function showLoginError(elementId, msg) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  // Limpa após 5s
  setTimeout(() => el.classList.add("hidden"), 5000);
}
```

---

## 12. FILTROS POR STATUS

### 12.1 — HTML dos filtros

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
  <button class="filter-btn" data-filter="corrigir">
    <i class="fa-solid fa-triangle-exclamation"></i> Corrigir
  </button>
</div>
```

### 12.2 — JavaScript dos filtros

```javascript
// Bindar de uma vez via delegação de eventos
document.getElementById("taskFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  // Atualiza estado visual
  document.querySelectorAll("#taskFilters .filter-btn")
    .forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // Aplica filtro
  currentFilter = btn.dataset.filter;
  renderTasksFiltered();
});

function renderTasksFiltered() {
  if (!currentItem?.tasks) return;

  const filtered = currentFilter === "all"
    ? currentItem.tasks
    : currentItem.tasks.filter(t => t.status === currentFilter);

  renderTasksList(filtered);
}
```

---

## 13. SELETOR VISUAL DE STATUS (em modais)

Este componente substitui um `<select>` comum por um grid 2×2 clicável:

### 13.1 — HTML

```html
<div class="form-group">
  <label>Status</label>

  <!-- Select oculto — mantido para serialização do form -->
  <select id="taskStatus" style="display: none;">
    <option value="planejado">Planejado</option>
    <option value="em-andamento">Em Andamento</option>
    <option value="concluido">Concluído</option>
    <option value="corrigir">Corrigir</option>
  </select>

  <!-- Seletor visual 2x2 -->
  <div class="status-selector" id="statusSelector">
    <button type="button" class="status-opt status-opt--planejado active"
            data-value="planejado">
      <span class="status-opt-icon"><i class="fa-solid fa-clipboard-list"></i></span>
      <span class="status-opt-label">Planejado</span>
    </button>
    <button type="button" class="status-opt status-opt--andamento"
            data-value="em-andamento">
      <span class="status-opt-icon"><i class="fa-solid fa-spinner"></i></span>
      <span class="status-opt-label">Em Andamento</span>
    </button>
    <button type="button" class="status-opt status-opt--concluido"
            data-value="concluido">
      <span class="status-opt-icon"><i class="fa-solid fa-circle-check"></i></span>
      <span class="status-opt-label">Concluído</span>
    </button>
    <button type="button" class="status-opt status-opt--corrigir"
            data-value="corrigir">
      <span class="status-opt-icon"><i class="fa-solid fa-triangle-exclamation"></i></span>
      <span class="status-opt-label">Corrigir</span>
    </button>
  </div>
</div>
```

### 13.2 — JavaScript

```javascript
// Bind do seletor visual — muda .active e sincroniza o <select> oculto
document.getElementById("statusSelector").addEventListener("click", (e) => {
  const opt = e.target.closest(".status-opt");
  if (!opt) return;

  document.querySelectorAll("#statusSelector .status-opt")
    .forEach(o => o.classList.remove("active"));
  opt.classList.add("active");

  // Sincroniza o select oculto
  document.getElementById("taskStatus").value = opt.dataset.value;
});

// Ao abrir o modal de edição, sincroniza o estado visual com o valor atual
function setStatusSelector(status) {
  // Atualiza select oculto
  document.getElementById("taskStatus").value = status;

  // Atualiza visual
  document.querySelectorAll("#statusSelector .status-opt").forEach(opt => {
    opt.classList.toggle("active", opt.dataset.value === status);
  });
}
```

---

## 14. NAVEGAÇÃO NA SIDEBAR

### 14.1 — HTML

Cada botão da sidebar tem `data-page` para identificar qual sub-página mostrar:

```html
<div class="sidebar-nav">
  <button class="sidebar-nav-item active" data-page="main">
    <i class="fa-solid fa-house"></i>
    <span>Principal</span>
  </button>
  <button class="sidebar-nav-item" data-page="import">
    <i class="fa-solid fa-file-import"></i>
    <span>Importar</span>
    <span class="nav-badge">IA</span>
  </button>
  <button class="sidebar-nav-item" data-page="resumo">
    <i class="fa-solid fa-chart-simple"></i>
    <span>Resumo</span>
  </button>
</div>
```

### 14.2 — JavaScript

```javascript
// Páginas internas do dashboard (não são .view-container — são divs dentro do .container)
const PAGES = {
  main:   document.getElementById("mainPage"),
  import: document.getElementById("importPage"),
  resumo: document.getElementById("resumoPage"),
};

function showPage(pageId) {
  // Esconde todas as páginas
  Object.values(PAGES).forEach(p => p?.classList.add("hidden"));

  // Mostra a solicitada
  if (PAGES[pageId]) PAGES[pageId].classList.remove("hidden");

  // Atualiza nav ativo
  document.querySelectorAll(".sidebar-nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });

  // Atualiza título no header
  const titles = {
    main:   "Painel Principal",
    import: "Importar com IA",
    resumo: "Resumo Geral",
  };
  const titleEl = document.getElementById("adminHeaderTitle");
  if (titleEl) titleEl.textContent = titles[pageId] || "";
}

// Bind de uma vez usando delegação de eventos
document.querySelector(".sidebar-nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".sidebar-nav-item");
  if (btn?.dataset.page) showPage(btn.dataset.page);
});
```

---

## 15. DROPZONE (DRAG & DROP)

### 15.1 — HTML

```html
<div class="dropzone" id="dropZone">
  <div class="dropzone-content">
    <div class="dropzone-icon">
      <i class="fa-solid fa-cloud-arrow-up"></i>
    </div>
    <div class="dropzone-title">Arraste seu arquivo aqui</div>
    <div class="dropzone-subtitle">Aceita .md, .txt — ou clique para selecionar</div>
    <!-- Input oculto ativado pelo clique na dropzone inteira -->
    <input type="file" id="fileInput" accept=".md,.txt,.markdown"
           class="dropzone-file-input" />
  </div>
  <!-- Overlay que aparece durante o drag -->
  <div class="dropzone-hover-overlay">
    <i class="fa-solid fa-cloud-arrow-up"></i>
    <span>Solte o arquivo aqui</span>
  </div>
</div>
```

### 15.2 — JavaScript

```javascript
function initDropzone() {
  const zone  = document.getElementById("dropZone");
  const input = document.getElementById("fileInput");

  if (!zone || !input) return;

  // Clique abre o seletor de arquivo
  zone.addEventListener("click", (e) => {
    if (!e.target.closest(".dropzone-hover-overlay")) input.click();
  });

  // Evitar que o browser abra o arquivo ao soltar fora da zona
  document.addEventListener("dragover",  e => e.preventDefault(), false);
  document.addEventListener("drop",      e => e.preventDefault(), false);

  // Ativa estilo de "hover" durante drag sobre a zona
  zone.addEventListener("dragenter", () => zone.classList.add("dragover"));
  zone.addEventListener("dragleave", (e) => {
    if (!zone.contains(e.relatedTarget)) zone.classList.remove("dragover");
  });

  // Processa arquivo solto
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  });

  // Processa arquivo selecionado via input
  input.addEventListener("change", () => {
    if (input.files[0]) processFile(input.files[0]);
    input.value = ""; // reset para permitir reselecionar o mesmo arquivo
  });
}

function processFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    document.getElementById("pasteTextarea").value = content;
    updateCharCount();
    // processar o conteúdo...
  };
  reader.onerror = () => showToast("Erro ao ler o arquivo.");
  reader.readAsText(file, "UTF-8");
}
```

---

## 16. PROGRESSO GERAL (BARRA + ANEL SVG)

### 16.1 — Barra de progresso

```javascript
function updateProgressBar(tasks) {
  if (!tasks || tasks.length === 0) {
    setProgressBar(0);
    return;
  }
  const done = tasks.filter(t => t.status === "concluido").length;
  const pct  = Math.round((done / tasks.length) * 100);
  setProgressBar(pct);
}

function setProgressBar(pct) {
  const fill  = document.getElementById("progressFill");
  const value = document.getElementById("progressValue");

  if (fill) {
    fill.style.width = `${pct}%`;
    fill.classList.toggle("complete", pct === 100);
  }
  if (value) value.textContent = `${pct}%`;
}
```

### 16.2 — Anel SVG de progresso

O anel usa `stroke-dashoffset` para animar. Circunferência = 2π × r = 2π × 50 ≈ **314**.

```html
<!-- SVG no HTML -->
<svg class="resumo-ring" viewBox="0 0 120 120">
  <circle class="resumo-ring-bg"   cx="60" cy="60" r="50" />
  <circle class="resumo-ring-fill" id="resumoRingFill"
          cx="60" cy="60" r="50"
          stroke-dasharray="314 314"
          stroke-dashoffset="314"
          transform="rotate(-90 60 60)" />
</svg>
<div class="resumo-ring-center">
  <span class="resumo-ring-pct" id="resumoRingPct">0%</span>
  <span class="resumo-ring-sub">concluídas</span>
</div>
```

```javascript
function updateProgressRing(doneTasks, totalTasks) {
  const pct        = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const circumference = 314; // 2π × 50
  const offset     = circumference - (pct / 100) * circumference;

  const ring    = document.getElementById("resumoRingFill");
  const pctEl   = document.getElementById("resumoRingPct");
  const hintEl  = document.getElementById("resumoProgressHint");

  if (ring)   ring.style.strokeDashoffset = offset;
  if (pctEl)  pctEl.textContent = `${pct}%`;
  if (hintEl) hintEl.textContent = `${doneTasks} de ${totalTasks} tarefas concluídas`;
}
```

---

## 17. PÁGINA DE RESUMO / DASHBOARD

A página de resumo agrega estatísticas de **todos os documentos** da coleção:

```javascript
function updateResumoPage(allItems) {
  if (!allItems) return;

  // Totais
  const totalItems    = allItems.length;
  const activeItems   = allItems.filter(r => r.status === "em-andamento").length;

  // Tarefas (array aninhado dentro de cada item)
  const allTasks      = allItems.flatMap(r => r.tasks || []);
  const totalTasks    = allTasks.length;
  const doneTasks     = allTasks.filter(t => t.status === "concluido").length;
  const inProgressT   = allTasks.filter(t => t.status === "em-andamento").length;
  const plannedT      = allTasks.filter(t => t.status === "planejado").length;
  const fixT          = allTasks.filter(t => t.status === "corrigir").length;

  // Atualiza stat cards
  setText("totalItems",    totalItems);
  setText("activeItems",   activeItems);
  setText("totalTasks",    totalTasks);
  setText("completedTasks", doneTasks);

  // Atualiza anel de progresso
  updateProgressRing(doneTasks, totalTasks);

  // Atualiza barras de status
  renderStatusBars([
    { label: "Concluído",    count: doneTasks,    color: "var(--done)",        pct: pct(doneTasks, totalTasks) },
    { label: "Em Andamento", count: inProgressT,  color: "var(--in-progress)", pct: pct(inProgressT, totalTasks) },
    { label: "Planejado",    count: plannedT,      color: "var(--planned)",     pct: pct(plannedT, totalTasks) },
    { label: "Corrigir",     count: fixT,          color: "var(--fix)",         pct: pct(fixT, totalTasks) },
  ]);

  // Atualiza lista de projetos recentes
  renderRecentItems(allItems.slice(0, 6));
}

function pct(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderStatusBars(stats) {
  const container = document.getElementById("resumoStatusBars");
  if (!container) return;

  container.innerHTML = stats.map(s => `
    <div class="resumo-status-row">
      <div class="resumo-status-label">
        <span>${escHtml(s.label)}</span>
        <span style="font-weight:700;">${s.count}</span>
      </div>
      <div class="resumo-status-bar-bg">
        <div class="resumo-status-bar-fill"
             style="width: ${s.pct}%; background: ${s.color};">
        </div>
      </div>
    </div>
  `).join("");
}
```

---

## 18. CLOUD FUNCTIONS (Firebase)

Use Cloud Functions para operações que não devem rodar no browser:

### 18.1 — Estrutura `functions/index.js`

```javascript
const functions = require("firebase-functions");
const admin     = require("firebase-admin");
admin.initializeApp();

// Trigger: novo documento criado na coleção "items"
exports.onItemCreated = functions.firestore
  .document("items/{itemId}")
  .onCreate(async (snap, context) => {
    const data   = snap.data() || {};
    const itemId = context.params.itemId;

    console.log("Novo item criado:", itemId, data);
    // Aqui: enviar email, notificação push, webhook, etc.
    return null;
  });
```

### 18.2 — `functions/package.json`

```json
{
  "name": "novoweb-[servico]-functions",
  "version": "1.0.0",
  "engines": { "node": "18" },
  "main": "index.js",
  "dependencies": {
    "firebase-admin":     "^11.0.0",
    "firebase-functions": "^4.0.0",
    "@sendgrid/mail":     "^7.7.0"
  }
}
```

---

## 19. PADRÃO DE NOMENCLATURA

Siga estas convenções em todo o código:

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

## 20. SEGURANÇA

### 20.1 — Sanitização de saída

**Todo dado vindo do Firestore ou do usuário deve ser sanitizado antes de ir pro DOM:**

```javascript
// Esta função é obrigatória em todo serviço NovoWeb
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ CORRETO:
card.innerHTML = `<span>${escHtml(item.name)}</span>`;

// ❌ ERRADO — nunca faça isso:
card.innerHTML = `<span>${item.name}</span>`;
```

### 20.2 — Dados sensíveis

```javascript
// ❌ NUNCA guarde senhas em texto puro no código
const PASS = "minhasenha123"; // ERRADO

// ✅ Use base64 como ofuscação mínima (não é criptografia, mas dificulta leitura casual)
const PASS = atob("bWluaGFzZW5oYTEyMw=="); // OK para projetos internos simples

// ✅ Credenciais de API nunca vão no front-end — use Cloud Functions
```

### 20.3 — Regras do Firestore

Configure sempre as `firestore.rules` antes de ir para produção:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas leitura pública por código de acesso (sem autenticação)
    match /relatorios/{docId} {
      allow read: if true;           // Cliente lê pelo accessCode via query
      allow write: if false;         // Escrita só via admin autenticado (ou Cloud Function)
    }
  }
}
```

---

## 21. FLUXO COMPLETO DE UMA TELA (EXEMPLO)

Este é o fluxo padrão que cada nova tela deve seguir:

```
Usuario clica "Entrar"
  │
  ▼
adminLogin()
  ├─ valida campos (email + senha)
  ├─ se inválido → showLoginError()
  └─ se válido
       ├─ sessionStorage.setItem("adminLogged", "true")
       ├─ isAdmin = true
       └─ enterAdminDashboard()
              ├─ showView("dashboardView")
              ├─ startListening()  ←── inicia onSnapshot
              └─ showPage("main")  ←── exibe página padrão

onSnapshot dispara
  │
  ▼
(debounce 300ms)
  │
  ▼
items = snap.docs.map(...)
renderSidebarList(items)
updateStats()
  └─ se currentItemId → renderDetail(currentItem)

Usuario clica em item na sidebar
  │
  ▼
selectItem(id)
  ├─ currentItemId = id
  ├─ currentItem = items.find(...)
  └─ renderDetail(currentItem)
         ├─ preenche campos do form
         ├─ renderTasksList(currentItem.tasks)
         └─ updateProgressBar(currentItem.tasks)

Usuario edita campo e clica "Salvar"
  │
  ▼
saveItem()
  ├─ setButtonLoading(btn, true)
  ├─ await db.doc(id).update({...dados, updatedAt: serverTimestamp()})
  ├─ showSuccess("Salvo!")
  └─ setButtonLoading(btn, false)
```

---

## 22. CHECKLIST FINAL PARA A IA

### HTML
- [ ] `<!doctype html>` e `<html lang="pt-BR">`
- [ ] Firebase SDK carregado **antes** do `design.css`
- [ ] Font Awesome com `media="print" onload` (não bloqueante)
- [ ] `.bg-blobs` como **primeiro filho** do `<body>`
- [ ] Todas as views com `class="view-container"` + apenas uma com `active`
- [ ] Views de dashboard com classe adicional `dashboard-view`
- [ ] Modais fora das `.view-container`, diretamente no `<body>`
- [ ] `#successMessage` no final do body (antes dos scripts)
- [ ] `<script src="notifications.js">` antes do script principal
- [ ] Único `<script>` inline no final do body com toda a lógica

### JavaScript
- [ ] Firebase inicializado antes de qualquer outra coisa
- [ ] Estado global declarado no topo (`let currentId`, `let items`, etc.)
- [ ] `initializeTheme()` chamado no `DOMContentLoaded`
- [ ] `handleRoute()` chamado no `DOMContentLoaded` + listener de `hashchange`
- [ ] Listeners Firebase com variáveis de `unsubscribe` para cleanup
- [ ] Debounce nos handlers `onSnapshot` (300ms)
- [ ] `escHtml()` em **toda** inserção de dados externos no DOM
- [ ] `setButtonLoading()` em todas operações assíncronas
- [ ] Modal de confirmação antes de qualquer `delete`
- [ ] Tratamento de erro (`try/catch`) em todas as operações Firebase

### Firebase
- [ ] Campos `createdAt` e `updatedAt` com `serverTimestamp()` em todos os documentos
- [ ] `accessCode` único gerado com `generateUniqueAccessCode()`
- [ ] `firestore.rules` adequadas (não deixar `allow write: if true` em produção)
- [ ] `firebase.json` com rewrite `** → /index.html`

---

*NovoWeb — Manual de Estrutura para IA. Versão 1.0 — Março de 2026.*  
*Aplica-se a todos os serviços: Viso, TIME, e qualquer futuro produto NovoWeb.*
