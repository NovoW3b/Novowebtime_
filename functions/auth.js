/**
 * auth.js — Funções de verificação de autenticação para Cloud Functions.
 *
 * Uso:
 *   const { verifyAdmin } = require("./auth");
 *   exports.minhaFuncao = functions.https.onCall(async (data, context) => {
 *     verifyAdmin(context); // lança erro automaticamente se não autenticado
 *     // ...resto da lógica
 *   });
 */
const functions = require("firebase-functions");

/**
 * Verifica se a chamada veio de um usuário autenticado no Firebase Auth.
 * Lança HttpsError("unauthenticated") se não houver sessão ativa.
 *
 * @param {functions.https.CallableContext} context
 */
function verifyAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Acesso negado: autenticação de administrador necessária.",
    );
  }
}

module.exports = { verifyAdmin };
