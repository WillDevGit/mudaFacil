-- Dados de exemplo para testes locais
-- Uso: psql -U postgres -d mudancas -f supabase/seed.sql

INSERT INTO cidades (nome, estado) VALUES
  ('Curitiba','PR'), ('Sao Paulo','SP'), ('Florianopolis','SC'), ('Porto Alegre','RS');

INSERT INTO empresas (nome, endereco) VALUES
  ('Mudancas Rapidas Ltda','Av. Brasil, 1000'),
  ('TransCargo Mudancas','Rua das Palmeiras, 250');

INSERT INTO telefones_empresa (empresa_id, telefone) VALUES
  (1,'(41) 3333-1000'), (1,'(41) 99999-1000'), (2,'(11) 4004-2000');

INSERT INTO clientes (cpf, rg, nome, endereco, cidade_id) VALUES
  ('12345678901','8887771','Ana Souza','Rua XV de Novembro, 45',1),
  ('98765432100','7776661','Bruno Lima','Av. Paulista, 900',2);

INSERT INTO telefones_cliente (cliente_id, telefone) VALUES
  (1,'(41) 98888-1111'), (2,'(11) 97777-2222');

INSERT INTO funcionarios (cpf, rg, nome, endereco, telefone, salario, tipo, empresa_id) VALUES
  ('11122233344','1112223','Carlos Mendes','Rua A, 10','(41) 96666-3333', 3500.00,'MOTORISTA',1),
  ('55566677788','5556667','Diego Alves','Rua B, 20','(11) 95555-4444', 4200.00,'OPERADOR',2);

-- Servicos + especializacoes (o trigger preenche servicos.tipo)
INSERT INTO servicos (nome, preco_hora) VALUES
  ('Transporte de moveis', 150.00),
  ('Icamento com guindaste', 400.00);

INSERT INTO transportes (servico_id, limite_carga, percentual_acrescimo) VALUES (1, 2000, 10);
INSERT INTO guindastes  (servico_id, tamanho_base, altura, bonus)          VALUES (2, 3.5, 18, 50);

INSERT INTO oferecem (empresa_id, servico_id) VALUES (1,1), (1,2), (2,1);

INSERT INTO pedidos (cliente_id, empresa_id, funcionario_cpf, endereco_partida, endereco_destino,
                     cidade_partida, cidade_destino, data_solicitacao, data_resolucao, aceito)
VALUES (1, 1, '11122233344', 'Rua XV de Novembro, 45', 'Av. Sete de Setembro, 800',
        1, 1, CURRENT_DATE, NULL, TRUE);

-- precos e total sao calculados pelos triggers
INSERT INTO itens_pedido (pedido_id, servico_id, tempo_duracao, acrescimo, bonus, data_fim) VALUES
  (1, 1, 4, 0, 0, CURRENT_DATE),
  (1, 2, 2, 100, 50, CURRENT_DATE);