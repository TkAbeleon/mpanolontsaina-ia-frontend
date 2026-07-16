# Mpanolontsaina IA

Assistant juridique IA trilingue (malgache/français, anglais géré côté backend) pour Madagascar : les visiteurs et utilisateurs posent des questions de droit (travail, foncier, famille...) et reçoivent des réponses citant leurs sources légales.

## Run & Operate

- `pnpm --filter @workspace/mpanolontsaina-ia run dev` — lance le frontend (géré par le workflow `artifacts/mpanolontsaina-ia: web`)
- `pnpm run typecheck` — typecheck complet
- Pas de base de données ni de backend interne pour cet artifact : tout passe par l'API externe déjà en production.

## Stack

- React + Vite (TypeScript strict), Tailwind, wouter (routing), TanStack Query
- Aucun backend/DB local pour cet artifact — c'est un frontend pur consommant une API externe déjà déployée : `http://api.mpanolontsaina-ia.duckdns.org`

## Where things live

- `artifacts/mpanolontsaina-ia/src/theme/colors.ts` — **source unique** de la palette (violet = confiance/IA, ocre/or = conseil). Ne jamais coder une couleur en dur ailleurs.
- `artifacts/mpanolontsaina-ia/src/i18n/translations.ts` + `I18nContext.tsx` — **source unique** des textes FR/MG. Toujours passer par `useI18n().t("clé")`, jamais de texte en dur dans un composant.
- `artifacts/mpanolontsaina-ia/src/api/client.ts` — **source unique** du client API (`authApi`, `usersApi`, `chatApi`), contrats définis par la spec backend fournie par l'équipe API.
- `artifacts/mpanolontsaina-ia/src/hooks/use-auth.tsx` — contexte d'authentification (vérifie la session via `usersApi.me()` au chargement).

## Architecture decisions

- L'API réelle est en HTTP (pas HTTPS) alors que l'aperçu sert le site en HTTPS : un navigateur bloquerait les appels directs ("mixed content"). Solution : `vite.config.ts` proxy `/ext-api` vers `http://api.mpanolontsaina-ia.duckdns.org`, et `client.ts` appelle `/ext-api` par défaut (variable `VITE_API_BASE_URL`, surchageable si besoin).
- Ce proxy ne fonctionne qu'en développement (serveur Vite). **Un build de production statique n'aura pas de proxy** : il faudra soit servir le frontend derrière un reverse proxy qui relaie `/ext-api`, soit migrer l'API vers HTTPS, avant de déployer en production réelle.
- Couleurs, textes et client API ont été fournis comme spécification figée par l'équipe backend/design : ils ont été copiés tels quels (adaptés en `.ts`/`.tsx` pour le typage strict) plutôt que réinventés.

## Product

- Pages : Accueil (`/`), Chat visiteur/connecté (`/chat`, `/chat/:conversationId`), Connexion/Inscription (`/login`, `/register`), Historique des conversations (`/history`), Compte (`/account`, avec suppression de compte).
- Chaque réponse de l'IA affiche ses sources juridiques citées (articles de loi). Sélecteur de langue FR/MG toujours visible.

## User preferences

- Communication en français, registre non-technique (novice).

## Gotchas

- Ne jamais coder en dur une couleur, un texte UI ou un appel HTTP direct à l'API externe : passer respectivement par `colors.ts`, `translations.ts`/`useI18n()`, et `client.ts`.
- Le proxy `/ext-api` (dev uniquement) doit être reconfiguré avant un vrai déploiement en production (voir "Architecture decisions").

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
