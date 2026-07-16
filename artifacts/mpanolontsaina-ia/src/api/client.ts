/**
 * MPANOLONTSAINA IA — CLIENT API (SOURCE UNIQUE)
 * ---------------------------------------------------
 * Basé sur : docs/02_contrats_api_auth_users.md et docs/03_contrats_api_chat.md
 * Base URL configurée via variable d'environnement (jamais en dur).
 *
 * L'API externe réelle est en HTTP (pas HTTPS) alors que ce site est servi en
 * HTTPS : un appel direct depuis le navigateur serait bloqué ("mixed
 * content"). On passe donc toujours par un proxy same-origin :
 * - en développement, le serveur Vite proxy "/ext-api" (voir vite.config.ts)
 * - en production (build statique, pas de serveur Vite), on utilise plutôt
 *   "/api/ext-api", que l'artifact API Server relaie côté serveur vers
 *   l'API externe (voir artifacts/api-server/src/routes/ext-api-proxy.ts)
 * Peut être surchargé via VITE_API_BASE_URL si besoin (ex. tests locaux).
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api/ext-api' : '/ext-api');
const API_PREFIX = '/api/v1';

export interface ApiErrorPayload {
  code?: string;
  message?: string;
  fields?: Record<string, string>;
}

export class ApiRequestError extends Error {
  code?: string;
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, code?: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

function getAccessToken(): string | null {
  return localStorage.getItem('mpanolontsaina_access_token');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.status === 'error') {
    const error: ApiErrorPayload | undefined = json?.error;
    throw new ApiRequestError(error?.message || 'Erreur API', res.status, error?.code, error?.fields);
  }
  return json.data as T;
}

// --- Types (dérivés des contrats API) ---
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  preferred_language?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResult {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: { id: string; email: string; full_name: string | null };
}

export interface RefreshResult {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LegalSource {
  code: string;
  article: string;
  excerpt_summary?: string;
}

export interface VisitorChatResult {
  session_id: string;
  language: string;
  answer: string;
  agent_source: string | null;
  sources: LegalSource[];
  persisted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_source?: string | null;
  sources?: LegalSource[];
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

export interface ConversationList {
  items: Conversation[];
  page: number;
  limit: number;
  total: number;
}

export interface SendMessageResult {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
  conversation_id: string;
}

// --- AUTH ---
export const authApi = {
  register: (email: string, password: string, full_name: string, preferred_language = 'fr') =>
    request<UserProfile>('/auth/register', {
      method: 'POST',
      body: { email, password, full_name, preferred_language },
    }),

  login: (email: string, password: string) =>
    request<LoginResult>('/auth/login', { method: 'POST', body: { email, password } }),

  refresh: (refresh_token: string) =>
    request<RefreshResult>('/auth/refresh', { method: 'POST', body: { refresh_token } }),

  logout: (refresh_token: string) =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: { refresh_token },
      auth: true,
    }),
};

// --- USERS ---
export const usersApi = {
  me: () => request<UserProfile>('/users/me', { auth: true }),
  updateMe: (payload: Partial<{ full_name: string; password: string; preferred_language: string }>) =>
    request<UserProfile>('/users/me', { method: 'PATCH', body: payload, auth: true }),
  deleteMe: (password: string, deletion_strategy: 'hard_delete' | 'anonymize', confirmation: string) =>
    request<{ message: string; deletion_strategy: string; deleted_at: string }>('/users/me', {
      method: 'DELETE',
      body: { password, deletion_strategy, confirmation },
      auth: true,
    }),
};

// --- CHAT ---
export const chatApi = {
  // Visiteur (non connecté) — pas de persistance serveur
  sendVisitorMessage: (
    session_id: string,
    message: string,
    language: string,
    history: Array<{ role: string; content: string }> = [],
  ) =>
    request<VisitorChatResult>('/chat/visitor', {
      method: 'POST',
      body: { session_id, message, language, history },
    }),

  // Utilisateur connecté — conversations persistantes
  createConversation: (title?: string) =>
    request<Conversation>('/chat/conversations', { method: 'POST', body: { title }, auth: true }),

  sendMessage: (conversationId: string, message: string) =>
    request<SendMessageResult>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { message },
      auth: true,
    }),

  listConversations: (page = 1, limit = 20) =>
    request<ConversationList>(`/chat/conversations?page=${page}&limit=${limit}`, { auth: true }),

  getConversation: (conversationId: string) =>
    request<ConversationDetail>(`/chat/conversations/${conversationId}`, { auth: true }),

  deleteConversation: (conversationId: string) =>
    request<{ message: string }>(`/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      auth: true,
    }),
};

// --- Utilitaire session visiteur ---
export function getOrCreateVisitorSessionId(): string {
  let id = localStorage.getItem('mpanolontsaina_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mpanolontsaina_session_id', id);
  }
  return id;
}
