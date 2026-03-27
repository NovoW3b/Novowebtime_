/**
 * config.js — Centraliza configuracoes do backend.
 *
 * Valores nao-sensiveis (phone, emails, sendgrid from) ficam em functions/.env
 * A chave SendGrid fica no Google Secret Manager:
 *   firebase functions:secrets:set SENDGRID_KEY
 *
 * Para testes locais, crie functions/.env.local com SENDGRID_KEY=SG.xxxx
 */

function getConfig() {
  const parseEmails = (str) =>
    str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return {
    sendgrid: {
      from: process.env.SENDGRID_FROM || "no-reply@example.com",
    },
    admin: {
      phone: process.env.ADMIN_PHONE || "",
      emails: parseEmails(process.env.ADMIN_EMAILS),
    },
  };
}

module.exports = { getConfig };