# Déploiement — Mpanolontsaina IA

Guide de déploiement sur un serveur Debian 11/12.

## Architecture en production

```
Internet (HTTPS 443)
       │
   [Nginx / Caddy]  ← reverse-proxy TLS (optionnel mais recommandé)
       │
   [Express :3000]  ← UN seul processus Node.js géré par pm2
       ├── /api/*          → routes API + proxy vers l'API externe HTTP
       └── /*              → fichiers statiques du frontend buildé (SPA fallback)
```

Pas de `vite preview`, pas de serveur de développement en production.  
Express sert directement les fichiers construits par `vite build`.

---

## Prérequis

- Serveur Debian 11 (Bullseye) ou 12 (Bookworm)
- Accès root (ou sudo)
- Git installé
- Accès réseau sortant vers `http://api.mpanolontsaina-ia.duckdns.org`

---

## Installation (première fois)

### 1. Cloner le dépôt

```bash
git clone <url-du-depot> /opt/mpanolontsaina
cd /opt/mpanolontsaina
```

### 2. Installer les dépendances système

```bash
sudo bash deploy/install.sh
```

Ce script installe : Node.js 22 LTS, pnpm, pm2, et configure le démarrage automatique.

### 3. Configurer l'environnement

```bash
cp deploy/.env.example .env
nano .env   # ajuster PORT si besoin (défaut : 3000)
```

### 4. Builder et démarrer

```bash
bash deploy/start.sh
```

Ce script :
1. Installe les dépendances npm (`pnpm install`)
2. Compile l'API server via esbuild → `artifacts/api-server/dist/index.mjs`
3. Compile le frontend via Vite → `artifacts/mpanolontsaina-ia/dist/public`
4. Démarre (ou redémarre) l'application via pm2

### 5. Sauvegarder la liste pm2 (persistance au reboot)

```bash
pm2 save
```

---

## Mises à jour

```bash
cd /opt/mpanolontsaina
git pull                        # récupérer les changements
bash deploy/start.sh --reload   # rebuild + rechargement sans downtime
pm2 save                        # sauvegarder la nouvelle config
```

---

## Commandes pm2 utiles

```bash
pm2 status                          # état de tous les processus
pm2 logs mpanolontsaina-ia          # logs en direct
pm2 logs mpanolontsaina-ia --lines 100  # 100 dernières lignes
pm2 restart mpanolontsaina-ia       # redémarrage
pm2 stop mpanolontsaina-ia          # arrêt
pm2 monit                           # tableau de bord temps réel
```

---

## Reverse-proxy Nginx (exemple)

Placer ce fichier dans `/etc/nginx/sites-available/mpanolontsaina` :

```nginx
server {
    listen 80;
    server_name <votre-domaine.mg>;

    # Redirection HTTPS (décommenter après avoir configuré le certificat)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Délai étendu pour les réponses IA (potentiellement longues)
        proxy_read_timeout 120s;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/mpanolontsaina /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Pour HTTPS avec Certbot :
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d <votre-domaine.mg>
```

---

## Variables d'environnement

| Variable             | Défaut                                        | Description                                              |
|----------------------|-----------------------------------------------|----------------------------------------------------------|
| `PORT`               | `3000`                                        | Port d'écoute Express                                    |
| `NODE_ENV`           | `production`                                  | Environnement Node                                       |
| `EXTERNAL_API_URL`   | `http://api.mpanolontsaina-ia.duckdns.org`    | URL de base de l'API externe (proxy serveur + Vite dev)  |
| `FRONTEND_DIST`      | *(auto)*                                      | Chemin absolu vers `dist/public` si la structure diffère |

---

## Structure des fichiers générés

```
/opt/mpanolontsaina/
├── artifacts/
│   ├── api-server/dist/
│   │   ├── index.mjs          ← bundle Node.js (API + proxy + static serving)
│   │   └── *.mjs.map          ← source maps
│   └── mpanolontsaina-ia/dist/public/
│       ├── index.html         ← point d'entrée SPA
│       └── assets/            ← JS/CSS avec hash (cache 1 an)
├── logs/
│   ├── out.log                ← stdout pm2
│   ├── error.log              ← stderr pm2
│   └── combined.log           ← tout combiné
├── deploy/
│   ├── ecosystem.config.cjs   ← configuration pm2
│   ├── install.sh             ← script d'installation Debian
│   ├── start.sh               ← build + démarrage
│   └── .env.example           ← modèle de configuration
└── .env                       ← configuration locale (ne pas committer)
```
