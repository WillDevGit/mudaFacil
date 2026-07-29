# Manual do Sistema — Gerenciamento de Empresa de Mudanças

## 1. Visão geral

Sistema web para gestão de uma empresa de mudanças: cadastro de empresas, clientes,
cidades, funcionários, serviços e pedidos (com itens e cálculo automático de preços).

**Tecnologias**

| Camada | Tecnologia |
| --- | --- |
| Front-end | React 19 + TypeScript + Vite |
| Roteamento / SSR | TanStack Start (TanStack Router) |
| Estado / dados | TanStack Query |
| UI | Tailwind CSS + shadcn/ui + lucide-react |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner (toasts) |
| Banco de dados | PostgreSQL (Supabase / PostgREST via `supabase-js`) |

## 2. Estrutura do banco de dados

### 2.1 Tabelas

| Tabela | Descrição | Chave primária |
| --- | --- | --- |
| `cidades` | Cidades (nome, estado) | `id` |
| `empresas` | Empresas de mudança | `id` |
| `telefones_empresa` | Atributo multivalorado de empresa | `id` |
| `clientes` | Clientes (CPF único, RG, endereço, cidade) | `codigo` |
| `telefones_cliente` | Atributo multivalorado de cliente | `id` |
| `funcionarios` | Funcionários vinculados a uma empresa | `cpf` |
| `servicos` | Entidade genérica de serviço (preço/hora) | `id` |
| `guindastes` | Especialização de serviço (base, altura, bônus) | `servico_id` |
| `transportes` | Especialização de serviço (carga, % acréscimo) | `servico_id` |
| `oferecem` | N:N entre empresas e serviços | `id` |
| `pedidos` | Pedido de mudança (cliente, empresa, rota, datas) | `codigo` |
| `itens_pedido` | Serviços contratados dentro de um pedido | `id` |

### 2.2 Relacionamentos (chaves estrangeiras)

- `clientes.cidade_id → cidades.id`
- `telefones_cliente.cliente_id → clientes.codigo` (ON DELETE CASCADE)
- `telefones_empresa.empresa_id → empresas.id` (ON DELETE CASCADE)
- `funcionarios.empresa_id → empresas.id`
- `guindastes.servico_id → servicos.id` (CASCADE) / `transportes.servico_id → servicos.id` (CASCADE)
- `oferecem.empresa_id → empresas.id`, `oferecem.servico_id → servicos.id`, com `UNIQUE(empresa_id, servico_id)`
- `pedidos.cliente_id → clientes.codigo`, `pedidos.empresa_id → empresas.id`,
  `pedidos.funcionario_cpf → funcionarios.cpf`,
  `pedidos.cidade_partida / cidade_destino → cidades.id`
- `itens_pedido.pedido_id → pedidos.codigo` (CASCADE), `itens_pedido.servico_id → servicos.id`

### 2.3 Restrições (constraints)

| Restrição | Tabela | Regra |
| --- | --- | --- |
| `clientes_cpf_key` | `clientes` | CPF único |
| `chk_salario` | `funcionarios` | `salario >= 0` |
| `chk_preco_hora` | `servicos` | `preco_hora > 0` |
| `servicos_tipo_check` | `servicos` | `tipo IN ('GUINDASTE','TRANSPORTE')` |
| `chk_tempo` | `itens_pedido` | `tempo_duracao > 0` |
| `chk_datas` | `pedidos` | `data_resolucao IS NULL OR data_resolucao >= data_solicitacao` |
| `oferecem_empresa_id_servico_id_key` | `oferecem` | par empresa/serviço não se repete |

### 2.4 Funções e gatilhos (regras de negócio no banco)

| Trigger | Evento | Função | Efeito |
| --- | --- | --- | --- |
| `tg_guindaste` | BEFORE INSERT em `guindastes` | `fn_guindaste()` | Impede que o serviço seja também transporte (especialização **disjunta**) e grava `tipo='GUINDASTE'` |
| `tg_transporte` | BEFORE INSERT em `transportes` | `fn_transporte()` | Espelho da regra acima, grava `tipo='TRANSPORTE'` |
| `tg_calcular_preco` | BEFORE INSERT/UPDATE em `itens_pedido` | `fn_calcular_preco()` | `preco = preco_hora × tempo_duracao + acrescimo − bonus` |
| `tg_total_pedido` | AFTER INSERT/UPDATE/DELETE em `itens_pedido` | `fn_total_pedido()` | Recalcula `pedidos.preco_total` como a soma dos itens |

> **Importante:** o front-end **nunca** calcula preços. Ele apenas envia
> `tempo_duracao`, `acrescimo` e `bonus` e exibe `preco` / `preco_total`
> devolvidos pelo banco após os gatilhos.

## 3. Estrutura do código

```
src/
  routes/
    __root.tsx            # shell da aplicação, Toaster, metadados
    _app.tsx              # layout com menu lateral fixo
    _app.index.tsx        # Dashboard (contadores)
    _app.empresas.tsx     # CRUD Empresas (+ telefones)
    _app.clientes.tsx     # CRUD Clientes (+ telefones, cidade)
    _app.cidades.tsx      # CRUD Cidades
    _app.funcionarios.tsx # CRUD Funcionários
    _app.servicos.tsx     # CRUD Serviços (Guindaste/Transporte)
    _app.pedidos.tsx      # CRUD Pedidos + itens do pedido
  components/
    app-sidebar.tsx       # menu lateral
    page-header.tsx       # título + busca + botão Novo
    confirm-delete.tsx    # diálogo de confirmação de exclusão
    sortable-header.tsx   # ordenação das colunas
    ui/                   # componentes shadcn/ui
  integrations/supabase/  # cliente e tipos gerados do banco
supabase/
  schema.sql              # criação de tabelas, constraints, funções e triggers
  seed.sql                # dados de exemplo
```

Padrão usado em todas as telas: listagem em tabela, campo de pesquisa,
ordenação por coluna, botões **Novo / Editar / Excluir** (com confirmação),
validação com Zod, estado de carregamento e toasts de sucesso/erro.

## 4. Como testar localmente

### Pré-requisitos

- Node.js 20+ (ou Bun)
- Docker Desktop (opção A) **ou** PostgreSQL 15+ instalado (opção B)

### Passo 1 — obter o código

```bash
# a partir do ZIP entregue, ou:
git clone <url-do-repositorio>
cd <pasta-do-projeto>
npm install
```

### Opção A (recomendada) — Supabase local via Docker

Reproduz exatamente o ambiente de produção (Postgres + PostgREST).

```bash
npm install -g supabase        # ou: brew install supabase/tap/supabase
supabase start                 # sobe os contêineres
```

O comando imprime `API URL` e `anon key`. Carregue o banco:

```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/schema.sql
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/seed.sql
```

Crie um arquivo `.env` na raiz:

```
VITE_SUPABASE_URL="http://127.0.0.1:54321"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon key impressa pelo supabase start>"
```

### Opção B — PostgreSQL puro + Supabase em nuvem para a API

Se quiser apenas inspecionar o banco no PostgreSQL local:

```bash
createdb mudancas
psql -U postgres -d mudancas -f supabase/schema.sql
psql -U postgres -d mudancas -f supabase/seed.sql
```

Nesse caso a aplicação continua apontando para o Supabase em nuvem
(as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
já entregues no `.env`), pois o front-end acessa o banco pela API REST
do Supabase, e não por conexão SQL direta.

### Passo 2 — rodar a aplicação

```bash
npm run dev
```

Acesse **http://localhost:8080**.

### Passo 3 — roteiro de teste sugerido

1. **Cidades** — cadastre "Londrina/PR", pesquise, ordene por nome, edite e exclua.
2. **Empresas** — cadastre uma empresa com dois telefones; edite removendo um telefone.
3. **Clientes** — cadastre um cliente vinculado a uma cidade; tente repetir o CPF
   (o banco rejeita pela restrição `UNIQUE`) e observe o toast de erro.
4. **Funcionários** — cadastre com salário negativo para ver a restrição `chk_salario`.
5. **Serviços** — crie um serviço do tipo *Transporte* e outro *Guindaste*;
   note que os campos específicos mudam conforme o tipo.
6. **Pedidos** — crie um pedido, adicione dois itens com durações diferentes e
   confira que **preço do item** e **preço total** aparecem preenchidos
   automaticamente pelos gatilhos. Exclua um item e veja o total recalculado.
7. **Dashboard** — confira os contadores atualizados.

### Verificando os gatilhos direto no banco

```sql
SELECT i.id, s.nome, i.tempo_duracao, i.acrescimo, i.bonus, i.preco
  FROM itens_pedido i JOIN servicos s ON s.id = i.servico_id
 WHERE i.pedido_id = 1;

SELECT codigo, preco_total FROM pedidos WHERE codigo = 1;
```

## 5. Solução de problemas

| Problema | Causa provável | Solução |
| --- | --- | --- |
| Tela em branco | dependências não instaladas | rode `npm install` novamente |
| Listas vazias | `.env` ausente ou incorreto | confira `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` |
| Erro de permissão nas consultas | GRANTs ausentes | reexecute o bloco final de `supabase/schema.sql` |
| Preço sempre nulo | triggers não criados | reexecute `supabase/schema.sql` |
| Porta 8080 ocupada | outro processo | `npm run dev -- --port 5173` |