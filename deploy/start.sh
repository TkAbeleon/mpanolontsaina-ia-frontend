#!/usr/bin/env bash
# =============================================================================
# start.sh — Build du projet et (re)démarrage via pm2
#
# Usage (depuis la racine du dépôt) :
#   bash deploy/start.sh              # build + start (première fois)
#   bash deploy/start.sh --reload     # build + reload sans downtime (rechargement)
#   bash deploy/start.sh --build-only # build seulement, sans toucher pm2
#
# Variables d'environnement attendues (dans .env ou l'environnement courant) :
#   PORT          Port d'écoute Express         (défaut : 3000)
#   NODE_ENV      Environnement Node             (défaut : production)
#   FRONTEND_DIST Chemin absolu vers dist/public (optionnel)
# =============================================================================
set -euo pipefail

# ── Répertoire racine (ce script est dans deploy/) ────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# ── Options ───────────────────────────────────────────────────────────────────
RELOAD=0
BUILD_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --reload)     RELOAD=1 ;;
    --build-only) BUILD_ONLY=1 ;;
  esac
done

# ── Couleurs ──────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
else
  GREEN=''; YELLOW=''; NC=''
fi
log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC}   $*"; }

# ── Charger .env si présent ───────────────────────────────────────────────────
if [ -f "$ROOT/.env" ]; then
  log "Chargement de $ROOT/.env..."
  set -o allexport
  # shellcheck source=/dev/null
  source "$ROOT/.env"
  set +o allexport
fi

# Valeurs par défaut
export NODE_ENV="${NODE_ENV:-production}"
export PORT="${PORT:-3000}"

log "NODE_ENV=$NODE_ENV  PORT=$PORT"

# ── 1. Dépendances ────────────────────────────────────────────────────────────
log "Installation des dépendances npm..."
pnpm install --frozen-lockfile

# ── 2. Build API Server ───────────────────────────────────────────────────────
log "Build de l'API server (esbuild)..."
pnpm --filter @workspace/api-server run build

# ── 3. Build Frontend ─────────────────────────────────────────────────────────
# Vite exige PORT et BASE_PATH même pour un build statique (validation dans
# vite.config.ts). PORT peut être n'importe quelle valeur pour le build.
log "Build du frontend React (Vite)..."
BASE_PATH="/" PORT="${PORT}" \
  pnpm --filter @workspace/mpanolontsaina-ia run build

log "Frontend buildé → artifacts/mpanolontsaina-ia/dist/public"

# ── 4. Créer le dossier logs ──────────────────────────────────────────────────
mkdir -p "$ROOT/logs"

# ── 5. pm2 ────────────────────────────────────────────────────────────────────
if [ "$BUILD_ONLY" = "1" ]; then
  log "Option --build-only : pm2 non touché."
  exit 0
fi

ECOSYSTEM="$ROOT/deploy/ecosystem.config.cjs"

if pm2 list | grep -q "mpanolontsaina-ia"; then
  if [ "$RELOAD" = "1" ]; then
    log "Rechargement sans downtime (pm2 reload)..."
    pm2 reload "$ECOSYSTEM" --env production
  else
    log "Redémarrage (pm2 restart)..."
    pm2 restart "$ECOSYSTEM" --env production
  fi
else
  log "Premier démarrage (pm2 start)..."
  pm2 start "$ECOSYSTEM" --env production
fi

# Afficher l'état
pm2 status

log "✓ Application démarrée sur le port $PORT"
log "  Logs en direct : pm2 logs mpanolontsaina-ia"
