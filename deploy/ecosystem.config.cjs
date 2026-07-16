/**
 * PM2 Ecosystem – Mpanolontsaina IA
 *
 * Un seul processus Node.js sert à la fois :
 *   • /api/*          → routes Express (proxy vers l'API externe + santé)
 *   • /* (tout reste) → fichiers statiques du frontend buildé + fallback SPA
 *
 * Usage :
 *   pm2 start deploy/ecosystem.config.cjs --env production
 *   pm2 save && pm2 startup   # persistance au reboot
 */

'use strict';

const path = require('path');

// Répertoire racine du dépôt (ce fichier est dans deploy/)
const ROOT = path.resolve(__dirname, '..');

module.exports = {
  apps: [
    {
      // ── Application principale ────────────────────────────────────────
      name: 'mpanolontsaina-ia',
      script: path.join(ROOT, 'artifacts/api-server/dist/index.mjs'),

      // Répertoire de travail = racine du dépôt
      cwd: ROOT,

      // ESM natif — ne pas utiliser node_args: ['--require'] ici
      node_args: ['--enable-source-maps'],

      // Nombre d'instances : 1 (passer à 'max' + mode cluster si besoin)
      instances: 1,
      exec_mode: 'fork',

      // Ne pas surveiller les fichiers (c'est une image de production)
      watch: false,

      // Redémarrage automatique si la mémoire dépasse 512 Mo
      max_memory_restart: '512M',

      // Délai entre redémarrages automatiques (ms)
      restart_delay: 3000,

      // Nombre max de redémarrages consécutifs avant abandon
      max_restarts: 10,

      // Logs
      error_file: path.join(ROOT, 'logs/error.log'),
      out_file:   path.join(ROOT, 'logs/out.log'),
      log_file:   path.join(ROOT, 'logs/combined.log'),
      time: true,   // horodatage sur chaque ligne de log
      merge_logs: true,

      // ── Variables d'environnement par défaut ─────────────────────────
      // Copiez .env.example → .env et adaptez, ou renseignez ici.
      env: {
        NODE_ENV: 'development',
      },

      // ── Variables d'environnement de PRODUCTION ──────────────────────
      // Activées avec : pm2 start ... --env production
      // Les valeurs process.env.* sont évaluées au moment où pm2 lit ce
      // fichier (via start.sh qui source .env en amont).
      env_production: {
        NODE_ENV: 'production',

        // Port d'écoute Express — lit PORT depuis .env, défaut 3000.
        PORT: process.env.PORT || '3000',

        // URL de l'API externe — lit EXTERNAL_API_URL depuis .env.
        EXTERNAL_API_URL: process.env.EXTERNAL_API_URL || 'http://api.mpanolontsaina-ia.duckdns.org',

        // (optionnel) Chemin absolu vers les fichiers buildés du frontend.
        // Laisser vide = chemin relatif automatique depuis dist/index.mjs.
        // FRONTEND_DIST: '/opt/mpanolontsaina/artifacts/mpanolontsaina-ia/dist/public',
      },
    },
  ],
};
