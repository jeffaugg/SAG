#!/usr/bin/env bash
# Funções compartilhadas pelos scripts de setup local (fresh-start / restart).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
COMPOSE="docker compose --env-file $ENV_FILE"

TUNNEL_NAME="sag"
FRONT_HOSTNAME="bebesaude.site"
API_HOSTNAME="api.bebesaude.site"

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

ensure_cloudflare_tunnel() {
    if ! command -v cloudflared >/dev/null 2>&1; then
        log "cloudflared não está instalado, pulando setup do túnel (baixe em https://github.com/cloudflare/cloudflared/releases)."
        return 0
    fi
    if ! command -v sc.exe >/dev/null 2>&1; then
        log "sc.exe não disponível (não é Windows?), pulando gerenciamento do serviço do túnel."
        return 0
    fi

    if [ ! -f "$HOME/.cloudflared/cert.pem" ]; then
        log "cloudflared ainda não está autenticado, abrindo login (autorize no navegador)..."
        cloudflared tunnel login
    fi

    if ! cloudflared tunnel list 2>/dev/null | awk '{print $2}' | grep -qx "$TUNNEL_NAME"; then
        log "Túnel '$TUNNEL_NAME' não existe, criando..."
        cloudflared tunnel create "$TUNNEL_NAME"
    fi

    log "Garantindo rotas de DNS para $FRONT_HOSTNAME e $API_HOSTNAME..."
    cloudflared tunnel route dns "$TUNNEL_NAME" "$FRONT_HOSTNAME" >/dev/null 2>&1 || true
    cloudflared tunnel route dns "$TUNNEL_NAME" "$API_HOSTNAME" >/dev/null 2>&1 || true

    if ! sc.exe query cloudflared >/dev/null 2>&1; then
        log "Serviço cloudflared não instalado, instalando..."
        local token
        token="$(cloudflared tunnel token "$TUNNEL_NAME")"
        cloudflared service install "$token"
        log "Serviço instalado. Confira se o Public Hostname do túnel '$TUNNEL_NAME' está configurado no dashboard Zero Trust (Networks > Tunnels): $FRONT_HOSTNAME -> localhost:4173 e $API_HOSTNAME -> localhost:3000."
    fi

    if sc.exe query cloudflared 2>/dev/null | grep -q "RUNNING"; then
        log "Túnel Cloudflare (serviço cloudflared) já está rodando."
        return 0
    fi

    log "Serviço cloudflared parado, iniciando..."
    if sc.exe start cloudflared >/dev/null 2>&1; then
        log "Túnel Cloudflare iniciado."
    else
        echo "Não foi possível iniciar o serviço cloudflared. Verifique com: sc query cloudflared" >&2
    fi
}

print_ready_message() {
    cat <<EOF

$(log "Ambiente pronto! ✅")

  Front (local):    http://localhost:4173
  API (local):      http://localhost:${SERVER_PORT}
  Swagger:          http://localhost:${SERVER_PORT}/api
  Adminer:          http://localhost:8080
  MinIO:            http://localhost:9001

  Front (público):  https://${FRONT_HOSTNAME}
  API (público):    https://${API_HOSTNAME}

  Usuário admin:
    CPF:   ${ADM_CPF}
    Senha: ${ADM_PASSWORD}

EOF
}
