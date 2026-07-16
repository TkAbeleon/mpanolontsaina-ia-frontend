/**
 * MPANOLONTSAINA IA — CLIENT API (SOURCE UNIQUE)
 * ---------------------------------------------------
 * Basé sur : 02_contrats_api_auth_users.md et 03_contrats_api_chat.md
 * Base URL configurée via variable d'environnement (jamais en dur).
 *
 * Exemple de configuration locale :
 *   VITE_API_BASE_URL=https://api.mpanolontsaina-ia.duckdns.org
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.mpanolontsaina-ia.duckdns.org";
const API_PREFIX = "/api/v1";

function getAccessToken() {
  return localStorage.getItem("mpanolontsaina_access_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.status === "error") {
    const err = new Error(json?.error?.message || "Erreur API");
    err.code = json?.error?.code;
    err.status = res.status;
    throw err;
  }
  return json.data;
}

// --- AUTH ---
export const authApi = {
  register: (email, password, full_name, preferred_language = "fr") =>
    request("/auth/register", { method: "POST", body: { email, password, full_name, preferred_language } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  refresh: (refresh_token) =>
    request("/auth/refresh", { method: "POST", body: { refresh_token } }),

  logout: (refresh_token) =>
    request("/auth/logout", { method: "POST", body: { refresh_token }, auth: true }),
};

// --- USERS ---
export const usersApi = {
  me: () => request("/users/me", { auth: true }),
  updateMe: (payload) => request("/users/me", { method: "PATCH", body: payload, auth: true }),
  deleteMe: (password, deletion_strategy, confirmation) =>
    request("/users/me", {
      method: "DELETE",
      body: { password, deletion_strategy, confirmation },
      auth: true,
    }),
};

// --- CHAT ---
export const chatApi = {
  // Visiteur (non connecté) — pas de persistance serveur
  sendVisitorMessage: (session_id, message, language, history = []) =>
    request("/chat/visitor", { method: "POST", body: { session_id, message, language, history } }),

  // Utilisateur connecté — conversations persistantes
  createConversation: (title) =>
    request("/chat/conversations", { method: "POST", body: { title }, auth: true }),

  sendMessage: (conversationId, message) =>
    request(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { message },
      auth: true,
    }),

  listConversations: (page = 1, limit = 20) =>
    request(`/chat/conversations?page=${page}&limit=${limit}`, { auth: true }),

  getConversation: (conversationId) =>
    request(`/chat/conversations/${conversationId}`, { auth: true }),

  deleteConversation: (conversationId) =>
    request(`/chat/conversations/${conversationId}`, { method: "DELETE", auth: true }),
};

// --- Utilitaire session visiteur ---
export function getOrCreateVisitorSessionId() {
  let id = localStorage.getItem("mpanolontsaina_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("mpanolontsaina_session_id", id);
  }
  return id;
}
