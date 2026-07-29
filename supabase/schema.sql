-- ============================================================
-- Sistema de Gerenciamento de Empresa de Mudancas
-- Script completo de criacao do banco (PostgreSQL)
-- Uso local:  psql -U postgres -d mudancas -f supabase/schema.sql
-- ============================================================

-- ------------------------- TABELAS --------------------------

CREATE TABLE cidades (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    estado CHAR(2)      NOT NULL
);

CREATE TABLE empresas (
    id       SERIAL PRIMARY KEY,
    nome     VARCHAR(120) NOT NULL,
    endereco VARCHAR(200) NOT NULL
);

CREATE TABLE telefones_empresa (
    id         SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    telefone   VARCHAR(20) NOT NULL
);

CREATE TABLE clientes (
    codigo    SERIAL PRIMARY KEY,
    cpf       CHAR(11) NOT NULL UNIQUE,
    rg        VARCHAR(20),
    nome      VARCHAR(120) NOT NULL,
    endereco  VARCHAR(200),
    cidade_id INTEGER REFERENCES cidades(id)
);

CREATE TABLE telefones_cliente (
    id         SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(codigo) ON DELETE CASCADE,
    telefone   VARCHAR(20)
);

CREATE TABLE funcionarios (
    cpf        CHAR(11) PRIMARY KEY,
    rg         VARCHAR(20),
    nome       VARCHAR(120),
    endereco   VARCHAR(200),
    telefone   VARCHAR(20),
    salario    NUMERIC(10,2),
    tipo       VARCHAR(40),
    empresa_id INTEGER REFERENCES empresas(id),
    CONSTRAINT chk_salario CHECK (salario >= 0)
);

-- Generalizacao: servico e' especializado em GUINDASTE ou TRANSPORTE
CREATE TABLE servicos (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(120),
    preco_hora NUMERIC(10,2) NOT NULL,
    tipo       VARCHAR(20),
    CONSTRAINT chk_preco_hora CHECK (preco_hora > 0),
    CONSTRAINT servicos_tipo_check CHECK (tipo IN ('GUINDASTE','TRANSPORTE'))
);

CREATE TABLE guindastes (
    servico_id   INTEGER PRIMARY KEY REFERENCES servicos(id) ON DELETE CASCADE,
    tamanho_base NUMERIC(10,2),
    altura       NUMERIC(10,2),
    bonus        NUMERIC(10,2)
);

CREATE TABLE transportes (
    servico_id           INTEGER PRIMARY KEY REFERENCES servicos(id) ON DELETE CASCADE,
    limite_carga         NUMERIC(10,2),
    percentual_acrescimo NUMERIC(10,2)
);

CREATE TABLE oferecem (
    id         SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    servico_id INTEGER NOT NULL REFERENCES servicos(id),
    UNIQUE (empresa_id, servico_id)
);

CREATE TABLE pedidos (
    codigo           SERIAL PRIMARY KEY,
    cliente_id       INTEGER NOT NULL REFERENCES clientes(codigo),
    empresa_id       INTEGER NOT NULL REFERENCES empresas(id),
    funcionario_cpf  CHAR(11) REFERENCES funcionarios(cpf),
    endereco_partida VARCHAR(200),
    endereco_destino VARCHAR(200),
    cidade_partida   INTEGER REFERENCES cidades(id),
    cidade_destino   INTEGER REFERENCES cidades(id),
    data_solicitacao DATE,
    data_resolucao   DATE,
    aceito           BOOLEAN DEFAULT FALSE,
    preco_total      NUMERIC(12,2) DEFAULT 0,
    CONSTRAINT chk_datas CHECK (data_resolucao IS NULL OR data_resolucao >= data_solicitacao)
);

CREATE TABLE itens_pedido (
    id            SERIAL PRIMARY KEY,
    pedido_id     INTEGER NOT NULL REFERENCES pedidos(codigo) ON DELETE CASCADE,
    servico_id    INTEGER NOT NULL REFERENCES servicos(id),
    tempo_duracao NUMERIC(10,2),
    acrescimo     NUMERIC(10,2) DEFAULT 0,
    bonus         NUMERIC(10,2) DEFAULT 0,
    preco         NUMERIC(12,2),
    data_fim      DATE,
    CONSTRAINT chk_tempo CHECK (tempo_duracao > 0)
);

-- --------------------- FUNCOES / TRIGGERS -------------------

-- Garante disjuncao da especializacao e marca o tipo do servico
CREATE OR REPLACE FUNCTION fn_guindaste() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM transportes WHERE servico_id = NEW.servico_id) THEN
        RAISE EXCEPTION 'Este servico ja pertence a especializacao Transporte.';
    END IF;
    UPDATE servicos SET tipo = 'GUINDASTE' WHERE id = NEW.servico_id;
    RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION fn_transporte() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM guindastes WHERE servico_id = NEW.servico_id) THEN
        RAISE EXCEPTION 'Este servico ja pertence a especializacao Guindaste.';
    END IF;
    UPDATE servicos SET tipo = 'TRANSPORTE' WHERE id = NEW.servico_id;
    RETURN NEW;
END; $$;

-- preco do item = preco_hora * tempo + acrescimo - bonus
CREATE OR REPLACE FUNCTION fn_calcular_preco() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_preco_hora NUMERIC;
BEGIN
    SELECT preco_hora INTO v_preco_hora FROM servicos WHERE id = NEW.servico_id;
    NEW.preco := (v_preco_hora * NEW.tempo_duracao) + NEW.acrescimo - NEW.bonus;
    RETURN NEW;
END; $$;

-- total do pedido = soma dos itens
CREATE OR REPLACE FUNCTION fn_total_pedido() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE pedidos
       SET preco_total = (SELECT COALESCE(SUM(preco),0) FROM itens_pedido
                           WHERE pedido_id = COALESCE(NEW.pedido_id, OLD.pedido_id))
     WHERE codigo = COALESCE(NEW.pedido_id, OLD.pedido_id);
    RETURN NULL;
END; $$;

CREATE TRIGGER tg_guindaste       BEFORE INSERT ON guindastes
    FOR EACH ROW EXECUTE FUNCTION fn_guindaste();
CREATE TRIGGER tg_transporte      BEFORE INSERT ON transportes
    FOR EACH ROW EXECUTE FUNCTION fn_transporte();
CREATE TRIGGER tg_calcular_preco  BEFORE INSERT OR UPDATE ON itens_pedido
    FOR EACH ROW EXECUTE FUNCTION fn_calcular_preco();
CREATE TRIGGER tg_total_pedido    AFTER INSERT OR UPDATE OR DELETE ON itens_pedido
    FOR EACH ROW EXECUTE FUNCTION fn_total_pedido();

-- ------------------ PERMISSOES (Supabase/PostgREST) ---------
-- Necessarias apenas quando o banco roda dentro do Supabase.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated';
    EXECUTE 'GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role';
    EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role';
  END IF;
END $$;