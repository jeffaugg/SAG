#!/usr/bin/env bash
# Deploy para a VPS de produção: dá push da branch atual para o GitHub e manda
# a VPS atualizar o código, rebuildar as imagens e subir os containers.
# Uso: scripts/deploy.sh [branch]  (default: branch atual)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/lib-common.sh"

VPS_HOST="sag-vps"
VPS_DIR="/home/deploy/app"
BRANCH="${1:-$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD)}"

if [ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]; then
    log "Você tem mudanças não commitadas. Commite ou descarte antes de fazer deploy."
    exit 1
fi

log "Enviando branch '${BRANCH}' para o GitHub..."
git -C "$ROOT_DIR" push origin "$BRANCH"

log "Atualizando código na VPS..."
ssh "$VPS_HOST" "
set -euo pipefail
cd '$VPS_DIR'
git fetch origin
git checkout '$BRANCH'
git reset --hard origin/'$BRANCH'
"

log "Buildando imagens na VPS..."
ssh "$VPS_HOST" "cd '$VPS_DIR' && docker compose build"

log "Subindo containers na VPS..."
ssh "$VPS_HOST" "cd '$VPS_DIR' && docker compose up -d && docker image prune -f"

log "Verificando saúde da API..."
if ssh "$VPS_HOST" "curl -sf http://127.0.0.1:3000/api >/dev/null"; then
    log "Deploy concluído. ✅"
    echo
    echo "  Front: https://bebesaude.site"
    echo "  API:   https://api.bebesaude.site"
    echo
else
    echo "API não respondeu após o deploy. Veja os logs com: ssh $VPS_HOST 'cd $VPS_DIR && docker compose logs api'" >&2
    exit 1
fi
