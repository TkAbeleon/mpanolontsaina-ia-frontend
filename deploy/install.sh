#!/usr/bin/env bash
# =============================================================================
# install.sh — Installation des dépendances sur Debian (11 Bullseye / 12 Bookworm)
#
# Ce script installe :
#   • Node.js 22 LTS (via le dépôt officiel NodeSource)
#   • pnpm (gestionnaire de paquets du monorepo)
#   • pm2 (gestionnaire de processus)
#   • Les dépendances npm du projet
#
# Usage (en tant que root ou avec sudo) :
#   chmod +x deploy/install.sh
#   sudo bash deploy/install.sh
#
# Variables d'environnement :
#   APP_DIR   Répertoire de l'application   (défaut : /opt/mpanolontsaina)
#   APP_USER  Utilisateur système dédié     (défaut : mpanolontsaina)
# =============================================================================
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-/opt/mpanolontsaina}"
APP_USER="${APP_USER:-mpanolontsaina}"
NODE_MAJOR=22
PNPM_VERSION="latest"

# ── Couleurs (désactivées si pas de TTY) ──────────────────────────────────────
if [ -t 1 ]; then
  GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; NC=''
fi

log()  { echo -e "${GREEN}[install]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC}   $*"; }
die()  { echo -e "${RED}[error]${NC}  $*" >&2; exit 1; }

# ── Vérification root ─────────────────────────────────────────────────────────
if [ "$(id -u)" -ne 0 ]; then
  die "Ce script doit être exécuté en tant que root (sudo bash install.sh)"
fi

# ── 1. Paquets système de base ────────────────────────────────────────────────
log "Mise à jour des paquets système..."
apt-get update -qq
apt-get install -y --no-install-recommends \
  curl \
  ca-certificates \
  gnupg \
  git \
  build-essential \
  python3

# ── 2. Node.js (via NodeSource) ───────────────────────────────────────────────
if command -v node &>/dev/null; then
  CURRENT_NODE=$(node --version | sed 's/v//' | cut -d. -f1)
  if [ "$CURRENT_NODE" -ge "$NODE_MAJOR" ]; then
    log "Node.js $(node --version) déjà installé — skip."
  else
    warn "Node.js $(node --version) trop ancien, mise à jour vers v${NODE_MAJOR}..."
    FORCE_NODE=1
  fi
else
  FORCE_NODE=1
fi

if [ "${FORCE_NODE:-0}" = "1" ]; then
  log "Installation de Node.js ${NODE_MAJOR} LTS..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

node --version
npm --version

# ── 3. pnpm ───────────────────────────────────────────────────────────────────
if command -v pnpm &>/dev/null; then
  log "pnpm $(pnpm --version) déjà installé."
else
  log "Installation de pnpm..."
  npm install -g "pnpm@${PNPM_VERSION}"
fi

pnpm --version

# ── 4. pm2 ────────────────────────────────────────────────────────────────────
if command -v pm2 &>/dev/null; then
  log "pm2 $(pm2 --version) déjà installé."
else
  log "Installation de pm2..."
  npm install -g pm2
fi

pm2 --version

# ── 5. Utilisateur système dédié ─────────────────────────────────────────────
if id "$APP_USER" &>/dev/null; then
  log "Utilisateur '$APP_USER' déjà présent."
else
  log "Création de l'utilisateur '$APP_USER'..."
  useradd --system --create-home --shell /bin/bash "$APP_USER"
fi

# ── 6. Répertoire de l'application ───────────────────────────────────────────
log "Préparation du répertoire $APP_DIR..."
mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/logs"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ── 7. Dépendances npm du projet ──────────────────────────────────────────────
# Doit être exécuté depuis le répertoire du dépôt cloné.
if [ -f "$APP_DIR/pnpm-workspace.yaml" ]; then
  log "Installation des dépendances npm (production uniquement)..."
  cd "$APP_DIR"
  # --frozen-lockfile : refuse d'installer si pnpm-lock.yaml est désynchronisé
  # Les devDependencies sont nécessaires au build ; on installe tout ici,
  # le flag --prod sera utilisé en phase de run après le build.
  sudo -u "$APP_USER" pnpm install --frozen-lockfile
else
  warn "Dépôt non encore cloné dans $APP_DIR — installez les dépendances manuellement :"
  warn "  cd $APP_DIR && pnpm install --frozen-lockfile"
fi

# ── 8. Démarrage automatique de pm2 au boot ───────────────────────────────────
log "Configuration du démarrage automatique de pm2..."
# Génère la commande systemd et l'applique
pm2_startup=$(sudo -u "$APP_USER" pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" 2>&1 | grep "sudo env" || true)
if [ -n "$pm2_startup" ]; then
  eval "$pm2_startup"
fi

# ── Récapitulatif ─────────────────────────────────────────────────────────────
log "────────────────────────────────────────────────────"
log "Installation terminée ✓"
log ""
log "Prochaines étapes :"
log "  1. Cloner le dépôt dans $APP_DIR (si pas encore fait) :"
log "       git clone <url-du-depot> $APP_DIR"
log "  2. Créer le fichier d'environnement :"
log "       cp $APP_DIR/deploy/.env.example $APP_DIR/.env"
log "       nano $APP_DIR/.env"
log "  3. Builder et démarrer l'application :"
log "       sudo -u $APP_USER bash $APP_DIR/deploy/start.sh"
log "  4. Sauvegarder la liste des processus pm2 :"
log "       sudo -u $APP_USER pm2 save"
log "────────────────────────────────────────────────────"
