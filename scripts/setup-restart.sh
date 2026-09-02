#!/usr/bin/env bash
# Reinicia o ambiente local preservando os dados existentes (não apaga volumes).
# Sobe os containers, aplica migrations pendentes (se houver) e garante o usuário admin.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/lib-common.sh"

require_env_file
cd "$ROOT_DIR"

log "Buildando imagens (api e front)..."
$COMPOSE build api front

log "Subindo toda a stack (dados existentes preservados)..."
$COMPOSE up -d

ensure_cloudflare_tunnel
wait_for_api
create_admin_user
print_ready_message
