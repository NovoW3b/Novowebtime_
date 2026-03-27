/**
 * business.js — Regras de negócio do agendamento (server-side).
 *
 * Por que isso existe?
 * Antes, o front-end escrevia DIRETAMENTE no Firestore, o que permitia que
 * qualquer pessoa (via Postman, Insomnia ou console do navegador) criasse
 * agendamentos falsos sem nenhuma validação.
 *
 * Agora o fluxo seguro é:
 *   Front-end → chama createAppointment (callable) → validação → rate limiting → Firestore
 *
 * O Firestore Rules bloqueia escritas diretas (allow create: if false).
 * Apenas o Admin SDK desta Cloud Function pode escrever.
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Horários disponíveis aceitos pelo sistema.
// IMPORTANTE: manter sincronizado com a lista `availableHours` do index.html.
const VALID_HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

// Rate limiting: máx de agendamentos por e-mail dentro da janela de tempo
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora

/**
 * Gera um ID determinístico no formato YYYY-MM-DD_HH:MM.
 * Garante que dois agendamentos no mesmo horário nunca coexistam.
 */
function buildDeterministicId(dateObj, timeStr) {
  const pad = (n) => (n < 10 ? "0" + String(n) : String(n));
  const y = dateObj.getFullYear();
  const m = pad(dateObj.getMonth() + 1);
  const d = pad(dateObj.getDate());
  const [hh = "0", mm = "0"] = (timeStr || "").split(":");
  return `${y}-${m}-${d}_${pad(parseInt(hh, 10))}:${pad(parseInt(mm, 10))}`;
}

/**
 * createAppointment — HTTPS callable (público, sem login).
 *
 * Fluxo:
 *   1. Valida todos os campos server-side
 *   2. Verifica limites por e-mail (anti-spam)
 *   3. Tenta criar o documento com ID determinístico (transação anti-duplicata)
 *   4. Retorna { docId } para o front-end
 *
 * Erros retornados:
 *   - functions/invalid-argument  → campos inválidos
 *   - functions/resource-exhausted → rate limit atingido
 *   - functions/already-exists    → horário já ocupado
 */
exports.createAppointment = functions.https.onCall(async (data, _context) => {
  // ── 1. Validação server-side ──────────────────────────────────────────────
  const fullName = (data.fullName || "").trim();
  const email    = (data.email    || "").trim().toLowerCase();
  const phone    = (data.phone    || "").trim();
  const reason   = (data.reason   || "").trim();
  const timeStr  = (data.time     || "").trim();
  const dateInput = data.date;

  if (!fullName) {
    throw new functions.https.HttpsError("invalid-argument", "Nome completo é obrigatório.");
  }
  if (!fullName || fullName.length > 120) {
    throw new functions.https.HttpsError("invalid-argument", "Nome inválido (máx. 120 caracteres).");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new functions.https.HttpsError("invalid-argument", "E-mail inválido.");
  }
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    throw new functions.https.HttpsError("invalid-argument", "Telefone inválido.");
  }
  if (reason.length > 500) {
    throw new functions.https.HttpsError("invalid-argument", "Motivo muito longo (máx. 500 caracteres).");
  }
  if (!timeStr || !VALID_HOURS.includes(timeStr)) {
    throw new functions.https.HttpsError("invalid-argument", "Horário inválido.");
  }

  // Converte data (aceita ISO string ou timestamp em ms)
  let dateObj;
  try {
    dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) throw new Error("data inválida");
  } catch {
    throw new functions.https.HttpsError("invalid-argument", "Data inválida.");
  }

  // Não permite agendar no passado
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (dateObj < hoje) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Não é possível agendar para datas no passado."
    );
  }

  // Não permite agendar mais de 1 ano no futuro
  const maxFuturo = new Date();
  maxFuturo.setFullYear(maxFuturo.getFullYear() + 1);
  if (dateObj > maxFuturo) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Data muito distante no futuro."
    );
  }

  const db = admin.firestore();

  // ── 2. Rate limiting por e-mail ───────────────────────────────────────────
  const emailKey = email.replace(/[^a-z0-9@._-]/g, "_"); // sanitiza para uso como doc ID
  const rateRef = db.collection("rateLimits").doc(emailKey);
  const rateSnap = await rateRef.get();
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (rateSnap.exists) {
    const rateData = rateSnap.data();
    // Mantém somente timestamps dentro da janela de 1 hora
    const recentes = (rateData.timestamps || []).filter((ts) => ts > windowStart);

    if (recentes.length >= RATE_LIMIT_MAX) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Muitos agendamentos em pouco tempo. Tente novamente em 1 hora."
      );
    }

    await rateRef.update({
      timestamps: [...recentes, now],
      ultimaAtualizacao: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    await rateRef.set({
      timestamps: [now],
      ultimaAtualizacao: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // ── 3. Cria o agendamento (transação anti-duplicata) ─────────────────────
  const docId = buildDeterministicId(dateObj, timeStr);
  const docRef = db.collection("appointments").doc(docId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (snap.exists) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Este horário já está reservado. Por favor, escolha outro."
      );
    }

    tx.set(docRef, {
      fullName,
      email,
      phone,
      reason,
      time: timeStr,
      date: admin.firestore.Timestamp.fromDate(dateObj),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  console.log(`[createAppointment] Agendamento criado: ${docId} (${email})`);
  return { docId };
});
