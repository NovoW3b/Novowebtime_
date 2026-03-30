/**
 * app.js — Camada de integração com Cloud Functions do NovoWeb Time.
 *
 * REGRA DESTE ARQUIVO: zero lógica de negócio.
 * Só chama Cloud Functions e traduz erros para o formato amigável da UI.
 *
 * Funcionalidades:
 *   1. loadAdminContact()   — carrega telefone e e-mails do admin uma vez ao iniciar
 *   2. callCreateAppointment() — cria agendamento com validação server-side + rate limiting
 *
 * IMPORTANTE: o HTML deve incluir o SDK do Firebase Functions ANTES deste arquivo:
 *   <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-functions-compat.js"></script>
 *   <script src="app.js"></script>
 */
(function () {
  // Referência à instância do Firebase Functions (região padrão us-central1)
  const functionsInstance = firebase.app().functions("us-central1");

  /**
   * Cache do contato admin.
   * Preenchido por loadAdminContact() ao iniciar a página.
   * Acessível via window._adminContact.phone e window._adminContact.emails
   */
  window._adminContact = { phone: "", emails: [] };

  /**
   * Carrega telefone e e-mails do admin via Cloud Function.
   * Chamado UMA VEZ no DOMContentLoaded do index.html.
   *
   * Após a chamada, window._adminContact estará disponível para
   * todas as funções de WhatsApp e e-mail da página.
   */
  window.loadAdminContact = async function () {
    try {
      const fn = functionsInstance.httpsCallable("getAdminContact");
      const result = await fn();
      window._adminContact = result.data || { phone: "", emails: [] };
      console.debug("[app.js] Contato admin carregado com sucesso.");
    } catch (err) {
      // Não bloqueia o carregamento da página — apenas loga o aviso
      console.warn("[app.js] Nao foi possivel carregar contato admin:", err.message);
    }
  };

  /**
   * Cria um agendamento via Cloud Function (com validação e rate limiting).
   * Substitui a escrita direta no Firestore (createAppointmentInFirestore).
   *
   * @param {Object} appointmentData
   *   { fullName, email, phone, reason, date (Date), time (string "HH:MM") }
   *
   * @returns {Promise<{docId: string}>}
   *
   * @throws Erros com .code:
   *   "slot-taken"       → horário já reservado
   *   "rate-limit"       → muitos agendamentos em pouco tempo
   *   "validation-error" → dados inválidos (mensagem descritiva)
   */
  window.callCreateAppointment = async function (appointmentData) {
    const fn = functionsInstance.httpsCallable("createAppointment");

    // Converte Date → ISO string para serialização correta via HTTPS
    const payload = {
      fullName: appointmentData.fullName,
      email: appointmentData.email,
      phone: appointmentData.phone,
      reason: appointmentData.reason,
      time: appointmentData.time,
      date:
        appointmentData.date instanceof Date
          ? appointmentData.date.toISOString()
          : appointmentData.date,
    };

    try {
      const result = await fn(payload);
      return result.data; // { docId }
    } catch (err) {
      // Traduz códigos Firebase Functions → códigos locais que o index.html já trata
      if (err.code === "functions/already-exists") {
        const e = new Error("Este horario ja esta reservado. Por favor, escolha outro.");
        e.code = "slot-taken";
        throw e;
      }
      if (err.code === "functions/resource-exhausted") {
        const e = new Error("Muitos agendamentos em pouco tempo. Tente novamente em 1 hora.");
        e.code = "rate-limit";
        throw e;
      }
      if (err.code === "functions/invalid-argument") {
        const e = new Error(
          err.message || "Dados invalidos. Verifique os campos e tente novamente.",
        );
        e.code = "validation-error";
        throw e;
      }
      // Qualquer outro erro — repassa para o handler da UI
      throw err;
    }
  };
})();
