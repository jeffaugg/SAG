
# SAG (Sistema de Apoio à Gestante)

![Capa do Projeto](https://github.com/user-attachments/assets/022a5127-55c0-4479-989a-9bede43e179c) <p align="center">
  <img src="https://img.shields.io/badge/status-em--desenvolvimento-yellow" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/licen%C3%A7a-MIT-blue" alt="Licença">
  </p>

> Um sistema integrado para otimizar o acompanhamento de gestantes de alto risco, melhorando a comunicação entre Unidades Básicas de Saúde (UBS) e Policlínicas.

---

## 📋 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
  * [O Problema](#o-problema)
  * [A Solução](#a-solução)
* [✨ Funcionalidades](#-funcionalidades)
* [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [📂 Documentação e Artefatos](#-documentação-e-artefatos)
* [🏁 Como Começar](#-como-começar)
  * [Pré-requisitos](#pré-requisitos)
  * [Instalação e Configuração](#instalação-e-configuração)
* [🔧 Comandos Úteis](#-comandos-úteis)
  * [Desenvolvimento](#desenvolvimento)
  * [Banco de Dados e Prisma](#banco-de-dados-e-prisma)
* [🤝 Contribuição](#-contribuição)
* [👥 Autores](#-autores)
* [📄 Licença](#-licença)
* [📫 Contato](#-contato)

---

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido no contexto do **Projeto Integrado II** do curso de Engenharia de Software - UFC, com o objetivo de resolver um problema real de comunicação entre unidades de saúde do município de Icó-CE, na coordenação do cuidado pré-natal de alto risco.

### O Problema

Atualmente, o encaminhamento de gestantes de alto risco das Unidades Básicas de Saúde (UBS) para a Policlínica é feito por meio de uma ficha de referência em papel. Esse método apresenta diversas falhas: os documentos são frequentemente perdidos, danificados ou não são atualizados após as consultas especializadas.

Essa lacuna na comunicação impede que os profissionais de saúde tenham acesso a informações críticas sobre o histórico da paciente, tratamentos prescritos e a evolução do caso, comprometendo a continuidade e a segurança do cuidado.

### A Solução

O **SAG (Sistema de Apoio à Gestante)** é um sistema integrado que centraliza os dados das gestantes, permitindo uma comunicação eficiente e em tempo real entre os profissionais da UBS e da Policlínica. O objetivo é garantir que as informações sejam sempre acessíveis e atualizadas, melhorando a qualidade e a coordenação do atendimento pré-natal.

---

## ✨ Funcionalidades

O sistema foi projetado com base nas necessidades dos profissionais de saúde e gestores, incluindo:

* **👤 Gestão de Usuários (Admin):**
    * Cadastrar novos usuários (Médicos, Enfermeiros, ADMs) através de um sistema de convites.
    * Listar todos os usuários com filtros por cargo ou município.
    * Excluir usuários, garantindo a integridade dos registros vinculados.
* **🔑 Autenticação e Perfis:**
    * Login seguro para todos os perfis de usuário.
    * Atualização de informações pessoais no perfil do usuário.
* **👩‍⚕️ Gestão de Pacientes e Atendimentos:**
    * Cadastro de novas pacientes, com verificação de duplicidade por CPF.
    * Registro detalhado de atendimentos clínicos (diagnóstico, exames, prescrições).
    * Encaminhamento seguro de atendimentos e informações clínicas entre unidades.
* **🏥 Gestão de Unidades de Saúde (Admin):**
    * CRUD completo para Policlínicas e Unidades Básicas de Saúde (UBS).

---

## 🚀 Tecnologias Utilizadas

Este projeto é um monorepo que utiliza as seguintes tecnologias:

* **Gerenciador do Monorepo:** [Turborepo](https://turbo.build/repo)
* **Backend (`/apps/api`):**
    * Framework: [NestJS](https://nestjs.com/)
    * ORM: [Prisma](https://www.prisma.io/)
    * Banco de Dados: [PostgreSQL](https://www.postgresql.org/)
    * Autenticação: [JWT](https://jwt.io/)
* **Frontend (`/apps/front`):**
    * Framework: [React](https://react.dev/)
    * Build Tool: [Vite](https://vitejs.dev/)
    * Linguagem: [TypeScript](https://www.typescriptlang.org/)
* **Infraestrutura e DevOps:**
    * Containerização: [Docker](https://www.docker.com/)
    * Gerenciamento de Segredos: [Infisical](https://infisical.com/)

---

## 📂 Documentação e Artefatos

Este repositório foca na implementação técnica. A documentação completa está disponível nos links abaixo:

- 🔗 **Protótipo no Figma**: [Visualizar protótipo](https://www.figma.com/files/team/1331679110874083825/project/372532365/Projeto-Integrado-2?fuid=1254121760543219742)
- 📚 **Documentos e Artefatos**: [Pasta no Google Drive](https://drive.google.com/drive/folders/14mtJAJ8NWnX8-yzEa5l_dEW2EzIcDsrZ)

---

## 🏁 Como Começar

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento localmente.

### Pré-requisitos

* Node.js >= 22.15.0
* npm >= 11.0
* Docker e Docker Compose
* [Infisical CLI](https://infisical.com/docs/cli/overview)

### Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/jeffaugg/sag.git](https://github.com/jeffaugg/sag.git)
    cd sag
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Infisical:**
    * Faça o login na sua conta Infisical:
        ```bash
        infisical login
        ```
    * Certifique-se de que o projeto está configurado corretamente conforme o arquivo `.infisical.json`.

---

## 🔧 Comandos Úteis

### Desenvolvimento

1.  **Suba o banco de dados com Docker:**
    * Este comando iniciará os contêineres do PostgreSQL e do Adminer.
    ```bash
    npm run docker-compose up -d
    ```
    * O Adminer (gerenciador de banco de dados) estará disponível em `http://localhost:8080`.

2.  **Gere o client do Prisma:**
    ```bash
    npm run db:build
    ```

3.  **Execute as migrações do banco de dados:**
    ```bash
    npm run db:migrate:dev
    ```

4.  **Inicie o ambiente de desenvolvimento:**
    * Este comando usa o Infisical para injetar as variáveis de ambiente e inicia a API e o front-end.
    ```bash
    npm run dev
    ```

### Ambiente Local via Docker (usando `.env`)

Como alternativa ao fluxo com Infisical, é possível subir toda a stack (front, API, Postgres, Mongo, Redis, MinIO e Adminer) usando apenas o arquivo `.env` local. Os scripts abaixo buildam as imagens, sobem os contêineres, aplicam as migrations e já deixam um usuário administrador criado (com o CPF e senha definidos em `ADM_CPF`/`ADM_PASSWORD` no `.env`).

* **`./scripts/setup-fresh.sh`** — Start do zero. **Apaga todos os dados** dos bancos locais (Postgres, Mongo, Redis, MinIO), recria os contêineres, reaplica as migrations e roda o seed completo (`scripts/seed.sh`), populando o banco com dados de exemplo já prontos para uso. Use quando quiser um ambiente limpo.
    ```bash
    ./scripts/setup-fresh.sh
    ```

* **`./scripts/setup-restart.sh`** — Reinicia o ambiente **sem apagar dados existentes**. Sobe/atualiza os contêineres e garante que o usuário admin existe. Use para reiniciar o sistema no dia a dia, sem perder o que já está no banco.
    ```bash
    ./scripts/setup-restart.sh
    ```

* **`./scripts/seed.sh`** — Popula o banco via chamadas à API cobrindo todas as entidades e os principais fluxos do sistema: usuário admin, um médico e um enfermeiro (cada um vinculado a uma unidade), uma Policlínica e uma UBS, dois pacientes (um vinculado a múltiplas unidades), gestações em diferentes status, atendimentos com anexos PDF reais (baixados de fontes públicas, com fallback local se não houver rede) e mensagens de chat, incluindo uma com imagem anexada — para já exercitar upload, exibição e download de documentos assim que o ambiente sobe. É chamado automaticamente pelo `setup-fresh.sh`; espera um banco vazio, então rodá-lo isoladamente só é seguro logo após um `setup-fresh.sh`.
    ```bash
    ./scripts/seed.sh
    ```

Ao final, o terminal mostra as URLs de cada serviço (front, API, Swagger, Adminer, MinIO) e as credenciais de todos os usuários criados (admin, médico e enfermeiro).

### Banco de Dados e Prisma

* **Para abrir o Prisma Studio (visualizador de dados):**
    ```bash
    cd apps/api
    npx prisma studio
    ```
* **Para criar uma nova migração:**
    ```bash
    cd apps/api
    npx prisma migrate dev --name nome_da_migracao
    ```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para manter o histórico de commits limpo e organizado, por favor, siga o padrão de commits do **[Conventional Commits](https://www.conventionalcommits.org/)**.

**Exemplos:**
- `feat`: Uma nova funcionalidade (`✨ feat: Adiciona login com e-mail e senha`)
- `fix`: Uma correção de bug (`🐛 fix: Corrige validação de CPF no cadastro`)
- `docs`: Mudanças na documentação (`📚 docs: Atualiza o README com novas instruções`)
- `refactor`: Refatoração de código que não altera a funcionalidade (`♻️ refactor: Otimiza a consulta de usuários`)
- `test`: Adição ou correção de testes (`✔️ test: Adiciona testes para o módulo de autenticação`)
- `chore`: Tarefas de build, configuração, etc. (`🔧 chore: Atualiza versão do NestJS`)

---

## 👥 Autores

<table>
  <tr>
  <td align="center">
      <a href="https://github.com/DanyelGranzotti">
        <img src="https://avatars.githubusercontent.com/DanyelGranzotti" width="100px;" alt="Danyel"/>
        <br /><sub><b>Danyel Granzotti</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/guilhermepereiraborges">
        <img src="https://avatars.githubusercontent.com/guilhermepereiraborges" width="100px;" alt="Guilherme"/>
        <br /><sub><b>Guilherme  Borges</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/jeffaugg">
        <img src="https://avatars.githubusercontent.com/jeffaugg" width="100px;" alt="Jeferson"/>
        <br /><sub><b>Jeferson Augusto de Melo</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/sheiely">
        <img src="https://avatars.githubusercontent.com/sheiely" width="100px;" alt="Sheiely"/>
        <br /><sub><b>Sheiely Nascimento</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/WendelRodriguesz">
        <img src="https://avatars.githubusercontent.com/WendelRodriguesz" width="100px;" alt="Wendel"/>
        <br /><sub><b>Wendel Rodrigues</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/liapsps">
        <img src="https://avatars.githubusercontent.com/liapsps" width="100px;" alt="Julia"/>
        <br /><sub><b>Ana Julia Chaves</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📫 Contato

- Projeto Integrado II – UFC – Engenharia de Software 
* Danyel Granzotti — [danyel.granzotti17@gmail.com](mailto:danyel.granzotti17@gmail.com)
* Guilherme Borges — [guilherme.pereira.borges.2004@gmail.com](mailto:guilherme.pereira.borges.2004@gmail.com)
* Jeferson Augusto De Melo — [jefersonaugusto@alu.ufc.br](mailto:jefersonaugusto@alu.ufc.br)
* Sheiely Nascimento — [sheielynascimento@gmail.com](mailto:sheielynascimento@gmail.com)
* Wendel Rodrigues — [wendeldev2010@gmail.com](mailto:wendeldev2010@gmail.com)
* Ana Julia Chaves — [lialilinbox@gmail.com](mailto:lialilinbox@gmail.com)
- Repositório: [https://github.com/jeffaugg/sag](https://github.com/jeffaugg/sag)