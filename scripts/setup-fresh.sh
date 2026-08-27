#!/usr/bin/env bash
# Sobe o ambiente local do zero: apaga os dados existentes (Postgres, Mongo, Redis, MinIO),
# recria os containers, aplica as migrations e cria o usuário admin.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/lib-common.sh"

require_env_file
cd "$ROOT_DIR"

log "Isso vai APAGAR todos os dados dos bancos locais (Postgres, Mongo, Redis, MinIO)."
read -r -p "Confirma? [y/N] " confirm
if [[ ! "$confirm" =~ ^[yY]$ ]]; then
    log "Cancelado."
    exit 0
fi

log "Derrubando containers e removendo volumes..."
$COMPOSE down -v

log "Buildando imagens (api e front)..."
$COMPOSE build api front

log "Subindo toda a stack..."
$COMPOSE up -d

wait_for_api

log "Populando banco com dados de exemplo (seed)..."
"$SCRIPT_DIR/seed.sh"

print_ready_message
