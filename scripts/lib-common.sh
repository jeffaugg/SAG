#!/usr/bin/env bash
# Funções compartilhadas pelos scripts de setup local (fresh-start / restart).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
COMPOSE="docker compose --env-file $ENV_FILE"

log() {
    echo -e "\033[1;34m[setup]\033[0m $1"
}

temp_dir() {
    local candidate="${TMPDIR:-${TEMP:-/tmp}}"
    case "$candidate" in
        *\\*|[A-Za-z]:/*|[A-Za-z]:\\*) candidate="/tmp" ;;
    esac
    printf '%s' "$candidate"
}

temp_file() {
    local prefix="${1:-sag}"
    mktemp "$(temp_dir)/${prefix}.XXXXXX"
}

require_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        echo "Arquivo .env não encontrado em $ENV_FILE" >&2
        exit 1
    fi
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
}

wait_for_api() {
    log "Aguardando API responder em http://localhost:${SERVER_PORT}/api ..."
    for ((i = 1; i <= 60; i++)); do
        if curl -sf "http://localhost:${SERVER_PORT}/api" >/dev/null 2>&1; then
            log "API disponível."
            return 0
        fi
        sleep 2
    done
    echo "API não respondeu a tempo. Veja os logs com: docker compose logs api" >&2
    exit 1
}

create_admin_user() {
    log "Criando usuário admin (cpf: ${ADM_CPF})..."
    local http_code
    local response_file
    local body_file
    response_file="$(temp_file sag_admin_register)"
    body_file="$(temp_file sag_admin_body)"
    printf '{"nome":"Administrador","cargo":"ADM","cpf":"%s","senha":"%s"}' "$ADM_CPF" "$ADM_PASSWORD" > "$body_file"
    http_code=$(curl -s -o "$response_file" -w "%{http_code}" \
        -X POST "http://localhost:${SERVER_PORT}/auth/register" \
        -H "Content-Type: application/json" \
        --data-binary "@$body_file")
    rm -f "$body_file"

    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        log "Usuário admin criado com sucesso."
    elif [ "$http_code" = "409" ]; then
        log "Usuário admin já existe, seguindo em frente."
    else
        echo "Falha ao criar usuário admin (HTTP $http_code):" >&2
        cat "$response_file" >&2
        rm -f "$response_file"
        exit 1
    fi
    rm -f "$response_file"
}

print_ready_message() {
    cat <<EOF

$(log "Ambiente pronto! ✅")

  Front:    http://localhost:4173
  API:      http://localhost:${SERVER_PORT}
  Swagger:  http://localhost:${SERVER_PORT}/api
  Adminer:  http://localhost:8080
  MinIO:    http://localhost:9001

  Usuário admin:
    CPF:   ${ADM_CPF}
    Senha: ${ADM_PASSWORD}

  Produção: https://bebesaude.site (deploy com scripts/deploy.sh)

EOF
}
