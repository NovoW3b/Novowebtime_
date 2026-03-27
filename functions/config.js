/**
 * config.js — Centraliza todas as configurações sensíveis do backend.
 *
 * As chaves NUNCA ficam no código. Configure-as com:
 *   firebase functions:config:set \
 *     admin.phone="5537991382659" \
 *     admin.emails="email1@ex.com,email2@ex.com" \
 *     sendgrid.key="SUA_CHAVE_SENDGRID" \
 *     sendgrid.from="no-reply@timenovoweb.com"
 *
 * Para testar localmente com o emulador, crie o arquivo
 *   functions/.runtimeconfig.json
 * com o conteúdo:
 *   {
 *     "admin": { "phone": "5537991382659", "emails": "email@ex.com" },
 *     "sendgrid": { "key": "SUA_CHAVE", "from": "no-reply@ex.com" }
 *   }
 */
const functions = require("firebase-functions");

function getConfig() {
  const raw = functions.config();
  const sg = raw.sendgrid || {};
  const adm = raw.admin || {};

  // E-mails separados por vírgula → array limpo
  const parseEmails = (str) =>
    str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const sendgridAdmins = parseEmails(sg.admins);
  const adminEmails = adm.emails ? parseEmails(adm.emails) : sendgridAdmins;

  return {
    sendgrid: {
      key: sg.key || null,
      from: sg.from || "no-reply@example.com",
      admins: sendgridAdmins,
    },
    admin: {
      // Telefone do WhatsApp do admin (somente dígitos, com DDI)
      phone: adm.phone || "",
      emails: adminEmails,
    },
  };
}

module.exports = { getConfig };
