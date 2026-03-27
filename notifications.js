/*
  notifications.js
  Frontend notification logic (modal + WhatsApp URL generator)

  How to integrate:
  - After your existing booking flow confirms the appointment, call:
      window.showNotificationModal(appointmentObject)
    where appointmentObject is an object with at least these fields:
      { clientName, clientPhone, clientEmail, date, time, reason }

  - Alternatively, dispatch a CustomEvent named 'appointmentConfirmed' with the
    appointment object in detail:
      document.dispatchEvent(new CustomEvent('appointmentConfirmed', { detail: appointmentObject }))

  Notes:
  - Email sending is handled server-side by a Firebase Cloud Function.
  - The modal lets the user choose WhatsApp (opens WhatsApp Web/App) or Email.
    Choosing Email does not open mail clients — backend email is automatic.
  - Admin phone number should be configured in `ADMIN_PHONE` below.
*/

(function () {
  // Telefone do admin lido de window._adminContact (carregado via Cloud Function pelo app.js).
  // Nunca fica hardcoded no HTML — sem fallback para número real.
  const ADMIN_PHONE = (window._adminContact && window._adminContact.phone) || "";

  function normalizePhoneNumber(phone) {
    if (!phone) return "";
    // keep only digits
    let digits = String(phone).replace(/\D/g, "");
    // remove leading zeros
    while (digits.length > 0 && digits[0] === "0") digits = digits.slice(1);
    // ensure country code (Brazil = 55) if missing — adjust as needed
    if (!digits.startsWith("55")) {
      digits = "55" + digits;
    }
    return digits;
  }

  let currentAppointment = null;

  // Create modal element references
  const modal = document.getElementById("notifyModal");
  const modalTitle = document.getElementById("notifyModalTitle");
  const modalBody = document.getElementById("notifyModalBody");
  const btnWhatsApp = document.getElementById("notifyWhatsappBtn");
  const btnEmail = document.getElementById("notifyEmailBtn");

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
  }

  function getWhatsAppUrl(appt) {
    const name = appt.clientName || "";
    const phone = appt.clientPhone || "";
    const email = appt.clientEmail || "";
    const date = appt.date || "";
    const time = appt.time || "";
    const reason = appt.reason || "";
    // Build message exactly as requested:
    // Novo Agendamento NovoWeb
    // Cliente: <name>
    // Telefone: <phone>
    // Email: <email>
    // Data: <date>
    // Horário: <time>
    // Motivo: <reason>
    const lines = [
      "Novo Agendamento NovoWeb",
      `Cliente: ${name}`,
      `Telefone: ${phone}`,
      `Email: ${email}`,
      `Data: ${date}`,
      `Horário: ${time}`,
      `Motivo: ${reason}`,
    ];

    const text = encodeURIComponent(lines.join("\n"));
    const adminPhone = normalizePhoneNumber(ADMIN_PHONE);
    const url = `https://wa.me/${adminPhone}?text=${text}`;
    console.log("WhatsApp URL (modal):", url);
    return url;
  }

  function openWhatsApp(appt) {
    const url = getWhatsAppUrl(appt);
    // Open in new tab/window — triggered by user click, so browser should allow it
    window.open(url, "_blank");
  }

  // Public function to be called by booking logic
  window.showNotificationModal = function (appointment) {
    currentAppointment = appointment || {};
    openModal();
  };

  // Also listen to a DOM event if your booking code prefers events
  document.addEventListener("appointmentConfirmed", function (ev) {
    window.showNotificationModal(ev.detail || {});
  });

  // Button handlers
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener("click", function (e) {
      e.preventDefault();
      if (!currentAppointment) {
        // nothing to send
        closeModal();
        return;
      }
      // Close modal first to keep only one user-initiated popup
      closeModal();
      // Small timeout to ensure modal close doesn't interfere with popup
      setTimeout(function () {
        openWhatsApp(currentAppointment);
      }, 150);
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener("click", function (e) {
      e.preventDefault();
      // Email is sent automatically by the backend Cloud Function when the appointment is created.
      // Here we simply close the modal and optionally show a temporary notice.
      closeModal();
      // Optional lightweight toast (if your app has one, prefer that). We'll use alert as fallback.
      try {
        showTemporaryNotice("E-mail será enviado automaticamente ao administrador.");
      } catch (err) {
        // fallback
        // eslint-disable-next-line no-alert
        alert("E-mail será enviado automaticamente ao administrador.");
      }
    });
  }

  function showTemporaryNotice(msg) {
    // Usa a função showToast do design system NovoWeb se disponível
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    // Implementação inline conforme design system (transform + opacity apenas)
    const notice = document.createElement("div");
    notice.className = "notify-temp-notice";
    notice.textContent = msg;
    document.body.appendChild(notice);
    requestAnimationFrame(function () {
      notice.classList.add("visible");
    });
    setTimeout(function () {
      notice.classList.remove("visible");
      setTimeout(function () {
        if (notice.parentNode) notice.parentNode.removeChild(notice);
      }, 300);
    }, 3500);
  }

  // Expõe showToast globalmente para que o inline script do index.html possa usá-lo
  window.showToast = showTemporaryNotice;
})();
