/**
 * notifications.js (backend) — Cloud Function para retornar contato do admin.
 *
 * Por que isso existe?
 * O telefone e os e-mails do admin NUNCA devem aparecer no código HTML/JS público.
 * Em vez disso, o front-end chama esta função ao carregar a página e recebe os dados
 * de forma segura, sem que fiquem expostos no código-fonte do navegador.
 *
 * Configure os valores com:
 *   firebase functions:config:set admin.phone="55XXXXXXXXXXX" admin.emails="email@ex.com"
 */
const functions = require("firebase-functions");
const { getConfig } = require("./config");

/**
 * getAdminContact — HTTPS callable (público, sem login necessário).
 *
 * Retorna:
 *   { phone: "55XXXXXXXXXXX", emails: ["admin@ex.com"] }
 *
 * O front-end chama isso UMA VEZ ao inicializar a página e armazena
 * em window._adminContact para uso nas funções de WhatsApp e e-mail.
 */
exports.getAdminContact = functions.https.onCall(async (_data, _context) => {
  const cfg = getConfig();
  return {
    phone: cfg.admin.phone,
    emails: cfg.admin.emails,
  };
});
