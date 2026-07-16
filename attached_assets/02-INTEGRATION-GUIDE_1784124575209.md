# 🔌 Guide d'intégration — React + API Mpanolontsaina IA

## 1. Stack & dépendances
```bash
npm create vite@latest . -- --template react
npm install react-router-dom
```
Tailwind (recommandé pour appliquer `colors.js` directement) :
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 2. Variables d'environnement
Fichier `.env` à la racine (Vite) :
```
VITE_API_BASE_URL=http://api.mpanolontsaina-ia.duckdns.org
```
⚠️ L'API tourne en **HTTP simple** (pas HTTPS). Si le frontend est servi en HTTPS, certains navigateurs bloquent les appels "mixed content". Solutions :
1. Demander au backend d'activer HTTPS (recommandé à terme), **ou**
2. Passer par un proxy Vite en dev (`vite.config.js` → `server.proxy`), **ou**
3. Servir aussi le frontend en HTTP pendant les tests.

```js
// vite.config.js (option proxy)
export default {
  server: {
    proxy: {
      "/api": {
        target: "http://api.mpanolontsaina-ia.duckdns.org",
        changeOrigin: true,
      },
    },
  },
};
```

## 3. Provider i18n (basé sur `translations.js`)
```jsx
// src/i18n/I18nContext.jsx
import { createContext, useContext, useState } from "react";
import { translations, defaultLanguage } from "./translations";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("mpanolontsaina_lang") || defaultLanguage
  );

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("mpanolontsaina_lang", newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key) => {
    const parts = key.split(".");
    let value = translations[lang];
    for (const p of parts) value = value?.[p];
    return value ?? key;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang: changeLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
```

```jsx
// main.jsx
import { I18nProvider } from "./i18n/I18nContext";
<I18nProvider><App /></I18nProvider>
```

## 4. Appel du chat visiteur (exemple complet)
```jsx
import { chatApi, getOrCreateVisitorSessionId } from "../api/client";
import { useI18n } from "../i18n/I18nContext";

async function handleSend(message, history) {
  const sessionId = getOrCreateVisitorSessionId();
  const { lang } = useI18n(); // "fr" ou "mg" — envoyé tel quel au backend
  try {
    const data = await chatApi.sendVisitorMessage(sessionId, message, lang, history);
    // data.answer, data.agent_source, data.sources[]
  } catch (err) {
    if (err.code === "RATE_LIMIT_EXCEEDED") { /* afficher t("chat.rateLimited") */ }
    else { /* afficher t("chat.errorGeneric") */ }
  }
}
```

## 5. Authentification (register/login) + persistance conversations
```jsx
import { authApi, chatApi } from "../api/client";

const { access_token, refresh_token, user } = await authApi.login(email, password);
localStorage.setItem("mpanolontsaina_access_token", access_token);
localStorage.setItem("mpanolontsaina_refresh_token", refresh_token);

const conv = await chatApi.createConversation();
const result = await chatApi.sendMessage(conv.id, "Ma question...");
// result.assistant_message.content, .sources
```

## 6. Gestion du refresh token (401 → refresh silencieux)
Ajouter un intercepteur simple dans `client.js` : si `res.status === 401`, appeler `authApi.refresh()` avec le refresh token stocké, rejouer la requête une fois, sinon rediriger vers `/login`.

## 7. Affichage des sources juridiques (composant `SourceCard`)
Chaque réponse de chat renvoie `data.sources[]` avec `code`, `article`, `excerpt_summary` (voir `03_contrats_api_chat.md`). Toujours afficher ces sources sous la réponse IA pour la transparence juridique — ne jamais les cacher, c'est un élément de confiance central du produit.

## 8. Résolution de la langue (important)
Le backend priorise dans cet ordre : `language` envoyé dans la requête > `preferred_language` du profil > détection auto. Toujours envoyer le `lang` actif de `useI18n()` dans chaque appel `chatApi.sendVisitorMessage` / création de compte, pour que l'UI et les réponses IA restent cohérentes.

## 9. Routing recommandé
```
/                        → Home (présentation + CTA "Discuter")
/chat                    → Chat visiteur (accessible sans compte)
/login, /register        → Auth
/history                 → Liste des conversations (auth requise)
/chat/:conversationId    → Conversation persistée (auth requise)
/account                 → Profil + suppression de compte
```
