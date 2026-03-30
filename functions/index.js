const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const { getConfig } = require("./config");

// Inicializa o Firebase Admin SDK (deve ser chamado apenas uma vez)
admin.initializeApp();

/**
 * Cloud Function: sendAppointmentEmail
 * Trigger: Firestore onCreate - dispara quando um novo agendamento e criado.
 *
 * Comportamento:
 *  - Idempotente: nao reenvia se emailSent ja for true no documento
 *  - Envia e-mail formatado com os dados do agendamento
 *  - Atualiza o documento com emailSent, emailSentAt, emailStatus
 *
 * A chave SendGrid e lida de process.env.SENDGRID_KEY, injetada pelo Firebase
 * a partir do arquivo functions/.env.timenovoweb (nunca commitado no git).
 */
exports.sendAppointmentEmail = functions.firestore
  .document("appointments/{id}")
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const docRef = snap.ref;
    const appointmentId = context.params.id;
    const cfg = getConfig();

    try {
      // Idempotencia: nao reenviar se o e-mail ja foi enviado
      if (data.emailSent) {
        console.log(`E-mail ja enviado para agendamento ${appointmentId}`);
        return null;
      }

      const adminEmails = cfg.admin.emails;
      if (!adminEmails.length) {
        console.error("Nenhum e-mail admin configurado (ADMIN_EMAILS em .env).");
        await docRef.update({
          emailStatus: "no_recipients",
          emailAttemptedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return null;
      }

      const key = process.env.SENDGRID_KEY;
      if (!key || key.startsWith("CONFIGURAR")) {
        console.error("Chave SendGrid ausente ou invalida; e-mail nao pode ser enviado.");
        await docRef.update({
          emailStatus: "no_api_key",
          emailAttemptedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return null;
      }

      // Configura o SendGrid com a chave do arquivo .env
      sgMail.setApiKey(key);

      // Monta e envia o e-mail
      const subject = `Novo agendamento: ${data.fullName || "Cliente"} - ${data.time || ""}`;
      const html = buildEmailHtml(data, appointmentId);

      await sgMail.send({
        to: adminEmails,
        from: cfg.sendgrid.from,
        subject,
        html,
      });

      console.log(`E-mail enviado para ${appointmentId} -> ${adminEmails.join(",")}`);

      // Marca como enviado
      await docRef.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        emailStatus: "sent",
      });
      return null;
    } catch (err) {
      console.error(`Falha ao enviar e-mail para ${appointmentId}:`, err);
      try {
        await docRef.update({
          emailStatus: "error",
          emailError: err && err.toString ? err.toString() : JSON.stringify(err),
          emailAttemptedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (uerr) {
        console.error("Falha ao atualizar doc com status de erro:", uerr);
      }
      return null;
    }
  });

// HTTPS callable: retorna telefone e e-mails do admin sem expor no codigo publico
const { getAdminContact } = require("./notifications");
exports.getAdminContact = getAdminContact;

// HTTPS callable: criacao de agendamento com validacao server-side e rate limiting
const { createAppointment } = require("./business");
exports.createAppointment = createAppointment;

function buildEmailHtml(data, appointmentId) {
  const date = data.date && data.date.toDate ? data.date.toDate().toLocaleDateString("pt-BR") : "";

  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>Novo agendamento</h2>
      <p><strong>ID:</strong> ${escapeHtml(appointmentId)}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(data.fullName || "")}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(data.phone || "")}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(data.email || "")}</p>
      <p><strong>Data:</strong> ${escapeHtml(date)} ${escapeHtml(data.time || "")}</p>
      <p><strong>Motivo:</strong><br/>${escapeHtml(data.reason || "")}</p>
      <hr/>
      <p style="font-size:0.9em;color:#666;">
        Este e-mail foi enviado automaticamente pelo sistema NovoWeb.
      </p>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
