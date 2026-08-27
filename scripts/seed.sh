#!/usr/bin/env bash
# Popula o banco com dados de exemplo cobrindo todas as entidades e principais
# casos de uso do sistema: usuários (ADM/Médico/Enfermeiro), Policlínica, UBS,
# vínculos usuário-unidade, pacientes, permissões de acesso, gestações,
# atendimentos (com anexo PDF) e mensagens de chat (texto e mídia).
#
# Assume um banco vazio (chamado por setup-fresh.sh, logo após as migrations).
# Rodar em cima de dados já existentes pode falhar, pois Médico/Enfermeiro
# usam CPFs fixos e a API não tem endpoint de busca de usuário por CPF.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/lib-common.sh"

require_env_file
API="http://localhost:${SERVER_PORT}"

# --- helpers ---------------------------------------------------------------

json_field() {
    # $1 = json string, $2 = jq filter
    echo "$1" | jq -r "$2"
}

post() {
    # $1 = path, $2 = json body, $3 = bearer token (opcional)
    local path="$1" body="$2" token="${3:-}"
    if [ -n "$token" ]; then
        curl -sf -X POST "${API}${path}" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${token}" \
            -d "$body"
    else
        curl -sf -X POST "${API}${path}" \
            -H "Content-Type: application/json" \
            -d "$body"
    fi
}

post_empty() {
    # $1 = path, $2 = bearer token
    curl -sf -X POST "${API}$1" -H "Authorization: Bearer $2"
}

register_and_login() {
    # $1 = nome, $2 = cargo, $3 = cpf, $4 = senha, $5 = organizacaoCNES (opcional)
    #
    # Sem organizacaoCNES: usa o token retornado pelo /auth/register (não passa
    # pela validação de organização). Com organizacaoCNES: faz login explícito
    # (necessário para cargos não-ADM obterem um token com a organização).
    local nome="$1" cargo="$2" cpf="$3" senha="$4" cnes="${5:-}"

    local register_resp
    register_resp=$(curl -s -X POST "${API}/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"nome\":\"${nome}\",\"cargo\":\"${cargo}\",\"cpf\":\"${cpf}\",\"senha\":\"${senha}\"}")

    if [ -z "$cnes" ]; then
        local token
        token=$(json_field "$register_resp" '.token // empty')
        if [ -n "$token" ]; then
            echo "$token"
            return 0
        fi
        # usuário já existia — cai para login (só é seguro para ADM, sem CNES)
    fi

    local login_body
    if [ -n "$cnes" ]; then
        login_body="{\"cpf\":\"${cpf}\",\"senha\":\"${senha}\",\"organizacaoCNES\":\"${cnes}\"}"
    else
        login_body="{\"cpf\":\"${cpf}\",\"senha\":\"${senha}\"}"
    fi
    curl -sf -X POST "${API}/auth/login" \
        -H "Content-Type: application/json" \
        -d "$login_body" | jq -r '.token'
}

user_id_from_token() {
    # decodifica o payload do JWT (2ª parte, base64url) e extrai userId
    local token="$1"
    local payload
    payload=$(echo "$token" | cut -d. -f2)
    case $(( ${#payload} % 4 )) in
        2) payload="${payload}==" ;;
        3) payload="${payload}=" ;;
    esac
    echo "$payload" | tr '_-' '/+' | base64 -d 2>/dev/null | jq -r '.userId'
}

fetch_mock_file() {
    # $1 = URL de origem, $2 = caminho de destino, $3 = fallback gerado localmente se o download falhar
    local url="$1" dest="$2" fallback="$3"
    if curl -sf -L --max-time 15 -o "$dest" "$url"; then
        return 0
    fi
    log "Não foi possível baixar ${url}, usando arquivo local de fallback."
    eval "$fallback"
}

# --- 1. Usuários -------------------------------------------------------------

log "Garantindo usuário admin..."
ADM_TOKEN=$(register_and_login "Administrador" "ADM" "$ADM_CPF" "$ADM_PASSWORD")
ADM_ID=$(user_id_from_token "$ADM_TOKEN")

log "Criando usuário Médico (Dr. João Silva)..."
MEDICO_CPF="11122233396"
MEDICO_SENHA="medico1234"
MEDICO_TOKEN_RAW=$(register_and_login "Dr. João Silva" "Medico" "$MEDICO_CPF" "$MEDICO_SENHA")
MEDICO_ID=$(user_id_from_token "$MEDICO_TOKEN_RAW")

log "Criando usuário Enfermeiro (Enf. Maria Souza)..."
ENFERMEIRO_CPF="22233344497"
ENFERMEIRO_SENHA="enfermeiro1234"
ENFERMEIRO_TOKEN_RAW=$(register_and_login "Enf. Maria Souza" "Enfermeiro" "$ENFERMEIRO_CPF" "$ENFERMEIRO_SENHA")
ENFERMEIRO_ID=$(user_id_from_token "$ENFERMEIRO_TOKEN_RAW")

# --- 2. Unidades de saúde (Policlínica + UBS) -------------------------------

log "Criando Policlínica..."
POLI_RESP=$(post "/policlinicas" \
    '{"nome":"Policlínica Central","localizacao":"Rua das Clínicas, 100 - Centro","contato":"+5511988887777","cnes":"1234567"}' \
    "$ADM_TOKEN")
POLI_ID=$(json_field "$POLI_RESP" '.id')
POLI_CNES="1234567"

log "Criando UBS..."
UBS_RESP=$(post "/ubs" \
    '{"nome":"UBS Jardim das Flores","localizacao":"Av. Saúde, 200 - Jardim das Flores","contato":"+5511977776666","cnes":"7654321"}' \
    "$ADM_TOKEN")
UBS_ID=$(json_field "$UBS_RESP" '.id')
UBS_CNES="7654321"

# --- 3. Vínculo usuário <-> unidade -----------------------------------------

log "Vinculando Médico à Policlínica..."
post_empty "/policlinicas/${POLI_ID}/usuarios/${MEDICO_ID}" "$ADM_TOKEN" >/dev/null

log "Vinculando Enfermeiro à UBS..."
post_empty "/ubs/${UBS_ID}/usuarios/${ENFERMEIRO_ID}" "$ADM_TOKEN" >/dev/null

# Re-login para obter tokens com organizacaoCNES (necessário para criar paciente/atendimento)
log "Reautenticando Médico e Enfermeiro com organização..."
MEDICO_TOKEN=$(register_and_login "Dr. João Silva" "Medico" "$MEDICO_CPF" "$MEDICO_SENHA" "$POLI_CNES")
ENFERMEIRO_TOKEN=$(register_and_login "Enf. Maria Souza" "Enfermeiro" "$ENFERMEIRO_CPF" "$ENFERMEIRO_SENHA" "$UBS_CNES")

# --- 4. Pacientes (+ permissões geradas automaticamente) --------------------

log "Criando paciente Ana Pereira (via UBS)..."
PACIENTE1_RESP=$(post "/pacientes" \
    '{"nome":"Ana Pereira","cpf":"98765432100","telefone":"11966665555","endereco":"Rua das Flores, 100"}' \
    "$ENFERMEIRO_TOKEN")
PACIENTE1_ID=$(json_field "$PACIENTE1_RESP" '.id')
PACIENTE1_CPF="98765432100"

log "Criando paciente Beatriz Costa (via Policlínica)..."
PACIENTE2_RESP=$(post "/pacientes" \
    '{"nome":"Beatriz Costa","cpf":"98765432299","telefone":"11955554444","endereco":"Av. Central, 50"}' \
    "$MEDICO_TOKEN")
PACIENTE2_ID=$(json_field "$PACIENTE2_RESP" '.id')
PACIENTE2_CPF="98765432299"

log "Associando Ana Pereira também à Policlínica (múltiplas unidades)..."
curl -sf -X POST "${API}/pacientes/${PACIENTE1_CPF}/associar" \
    -H "Authorization: Bearer ${MEDICO_TOKEN}" >/dev/null

# --- 5. Gestações -------------------------------------------------------------

log "Criando gestação (Pendente) para Ana Pereira..."
GESTACAO1_RESP=$(post "/gestacoes" \
    "{\"inicio\":\"2026-02-01T00:00:00.000Z\",\"status\":\"Pendente\",\"pacienteId\":\"${PACIENTE1_ID}\"}" \
    "$ENFERMEIRO_TOKEN")
GESTACAO1_ID=$(json_field "$GESTACAO1_RESP" '.id')

log "Criando gestação (Fechado) para Beatriz Costa..."
GESTACAO2_RESP=$(post "/gestacoes" \
    "{\"inicio\":\"2025-05-10T00:00:00.000Z\",\"fim\":\"2026-02-15T00:00:00.000Z\",\"status\":\"Fechado\",\"pacienteId\":\"${PACIENTE2_ID}\"}" \
    "$MEDICO_TOKEN")
GESTACAO2_ID=$(json_field "$GESTACAO2_RESP" '.id')

# --- 6. Atendimentos (com anexos PDF reais, para exercitar upload/exibição/download) ---

fallback_pdf() {
    printf '%%PDF-1.4\n%%seed\n1 0 obj<<>>endobj\ntrailer<<>>\n%%%%EOF' >"$1"
}

log "Baixando arquivos PDF de exemplo (fonte: w3.org)..."
PDF1="/tmp/sag_seed_laudo_exames.pdf"
PDF2="/tmp/sag_seed_ficha_prenatal.pdf"
fetch_mock_file "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" "$PDF1" "fallback_pdf '$PDF1'"
fetch_mock_file "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" "$PDF2" "fallback_pdf '$PDF2'"

log "Criando atendimento com 2 anexos PDF para a gestação de Ana Pereira..."
curl -sf -X POST "${API}/atendimentos" \
    -H "Authorization: Bearer ${ENFERMEIRO_TOKEN}" \
    -F "gestacaoId=${GESTACAO1_ID}" \
    -F "descricao=Consulta de pré-natal de rotina, sinais vitais normais. Exames e ficha em anexo." \
    -F "file=@${PDF1};type=application/pdf;filename=laudo_exames.pdf" \
    -F "file=@${PDF2};type=application/pdf;filename=ficha_prenatal.pdf" >/dev/null

log "Criando atendimento com anexo PDF para a gestação de Beatriz Costa..."
PDF3="/tmp/sag_seed_relatorio_parto.pdf"
fetch_mock_file "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" "$PDF3" "fallback_pdf '$PDF3'"
curl -sf -X POST "${API}/atendimentos" \
    -H "Authorization: Bearer ${MEDICO_TOKEN}" \
    -F "gestacaoId=${GESTACAO2_ID}" \
    -F "descricao=Encerramento de acompanhamento pré-natal, parto realizado sem intercorrências. Relatório em anexo." \
    -F "file=@${PDF3};type=application/pdf;filename=relatorio_parto.pdf" >/dev/null

rm -f "$PDF1" "$PDF2" "$PDF3"

# --- 7. Mensagens (chat, incluindo anexo de imagem para exercitar upload/exibição/download) ---

log "Enviando mensagens de texto na gestação de Ana Pereira..."
post "/mensagens" \
    "{\"gestacao\":\"${GESTACAO1_ID}\",\"tipo\":\"TEXTO\",\"conteudo\":{\"texto\":\"Paciente encaminhada para acompanhamento especializado.\"}}" \
    "$ENFERMEIRO_TOKEN" >/dev/null
post "/mensagens" \
    "{\"gestacao\":\"${GESTACAO1_ID}\",\"tipo\":\"TEXTO\",\"conteudo\":{\"texto\":\"Recebido, agendando primeira consulta.\"}}" \
    "$MEDICO_TOKEN" >/dev/null

log "Baixando imagem de exemplo (fonte: picsum.photos) para mensagem com mídia..."
fallback_jpg() {
    # 1x1 JPEG mínimo válido, em base64
    base64 -d >"$1" <<'B64'
/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkI
CQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQ
EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIA
AhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEB
AQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX
/9k=
B64
}
IMG="/tmp/sag_seed_ultrassom.jpg"
fetch_mock_file "https://picsum.photos/seed/sag-prenatal/640/480" "$IMG" "fallback_jpg '$IMG'"

log "Enviando mensagem com imagem anexada na gestação de Ana Pereira..."
curl -sf -X POST "${API}/mensagens/with-file" \
    -H "Authorization: Bearer ${MEDICO_TOKEN}" \
    -F "gestacao=${GESTACAO1_ID}" \
    -F "tipo=MIDIA" \
    -F "texto=Segue imagem do último ultrassom." \
    -F "file=@${IMG};type=image/jpeg;filename=ultrassom.jpg" >/dev/null
rm -f "$IMG"

log "Enviando mensagem de texto na gestação de Beatriz Costa..."
post "/mensagens" \
    "{\"gestacao\":\"${GESTACAO2_ID}\",\"tipo\":\"TEXTO\",\"conteudo\":{\"texto\":\"Acompanhamento finalizado com sucesso.\"}}" \
    "$MEDICO_TOKEN" >/dev/null

log "Seed concluído. ✅"
cat <<EOF

  Usuários criados:
    ADM:        cpf=${ADM_CPF} senha=${ADM_PASSWORD}
    Médico:     cpf=${MEDICO_CPF} senha=${MEDICO_SENHA} (Policlínica Central - cnes ${POLI_CNES})
    Enfermeiro: cpf=${ENFERMEIRO_CPF} senha=${ENFERMEIRO_SENHA} (UBS Jardim das Flores - cnes ${UBS_CNES})

  Pacientes:
    Ana Pereira (cpf ${PACIENTE1_CPF}) — UBS + Policlínica, gestação Pendente,
      1 atendimento com 2 PDFs anexados, 3 mensagens (incluindo 1 com imagem)
    Beatriz Costa (cpf ${PACIENTE2_CPF}) — Policlínica, gestação Fechado,
      1 atendimento com 1 PDF anexado, 1 mensagem

EOF
