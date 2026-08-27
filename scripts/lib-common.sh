#!/usr/bin/env bash
# Funções compartilhadas pelos scripts de setup local (fresh-start / restart).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
COMPOSE="docker compose --env-file $ENV_FILE"

log() {
    echo -e "\033[1;34m[setup]\033[0m $1"
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
    for _ in $(seq 1 60); do
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
    http_code=$(curl -s -o /tmp/sag_admin_register.json -w "%{http_code}" \
        -X POST "http://localhost:${SERVER_PORT}/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"nome\":\"Administrador\",\"cargo\":\"ADM\",\"cpf\":\"${ADM_CPF}\",\"senha\":\"${ADM_PASSWORD}\"}")

    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        log "Usuário admin criado com sucesso."
    elif [ "$http_code" = "409" ]; then
        log "Usuário admin já existe, seguindo em frente."
    else
        echo "Falha ao criar usuário admin (HTTP $http_code):" >&2
        cat /tmp/sag_admin_register.json >&2
        exit 1
    fi
    rm -f /tmp/sag_admin_register.json
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

EOF
}
