# PI2 Monorepo - SAG - Sistema de Apoio à Gestante

Este projeto é um monorepo gerenciado com Turborepo, utilizando React, NestJS, Prisma, Docker, PostgreSQL e Infisical para gerenciamento de variáveis de ambiente.

## Pré-requisitos

- Node.js >= 22.15.0
- npm >= 11.0
- Docker e Docker Compose
- [Infisical CLI](https://infisical.com/docs/cli/overview)

## 1. Instalação e Configuração

### 1.1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd PI2
```

### 1.2. Instale as dependências

```bash
npm install
```

### 1.3. Configure o Infisical

1. Instale o CLI do Infisical (caso não tenha): https://infisical.com/docs/cli/overview
2. Faça login:
   ```bash
   infisical login
   ```

## 2. Rodando o Projeto em Desenvolvimento

### 2.1. Suba o banco de dados com Docker

```bash
npm run docker-compose up -d
```

- O banco PostgreSQL e Adminer serão iniciados.
- Adminer disponível em: http://localhost:8080

### 2.2. Gere o client do Prisma

```bash
npm run db:build
```

### 2.3. Execute as migrações do banco

```bash
npm run db:migrate:dev
```

### 2.4. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

- O backend será iniciado em modo watch.

## 3. Prisma

- Para abrir o Prisma Studio:
  ```bash
  cd apps/api
  npx prisma studio
  ```
- Para criar uma nova migração:
  ```bash
  cd apps/api
  npx prisma migrate dev --name nome_da_migracao
  ```

## 4. Criando Novos Módulos na API (NestJS CLI)

Acesse a pasta `apps/api` e utilize o CLI do NestJS:

```bash
cd apps/api
npx nest g resource nome-do-modulo
```

- Os arquivos serão criados em `src/modules/nome-do-modulo`.
- Siga a estrutura de pastas e utilize DTOs para validação.

## 5. Padrão de Commits

Utilize o padrão de commits do [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits):

Exemplos:
- `✨ feat: descrição do que foi feito` (nova funcionalidade)
- `🐛 fix: descrição do bug corrigido`
- `📚 docs: alteração na documentação`
- `♻️ refactor: refatoração de código`
- `✔️ test: adição ou alteração de testes`
- `🔧 chore: tarefas de build, infra, etc.`

Consulte a tabela completa no repositório oficial para mais exemplos e recomendações.

---

Dúvidas? Consulte a documentação de cada ferramenta.