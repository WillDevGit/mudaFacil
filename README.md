# Moving Company Manager

Desenvolva um sistema web moderno para gerenciamento de uma empresa de mudanças utilizando React, TypeScript, Tailwind CSS e os componentes do shadcn/ui.

O banco de dados já está criado no Supabase e deve ser utilizado como única fonte de dados. Utilize as tabelas existentes e seus relacionamentos, sem criar novas tabelas.

Crie uma interface profissional com menu lateral fixo, layout responsivo e tema claro.

O menu deve possuir:

• Dashboard (deixe apenas um placeholder por enquanto)

• Empresas

• Clientes

• Cidades

• Funcionários

• Serviços

• Pedidos

Implemente um CRUD completo para cada entidade.

Todas as telas devem possuir:

• Listagem em tabela

• Campo de pesquisa

• Ordenação por colunas quando fizer sentido

• Botão Novo

• Botão Editar

• Botão Excluir com confirmação

• Feedback visual de sucesso e erro (toast)

• Loading durante operações

• Validação dos campos obrigatórios

Empresas

Campos:

- Nome

- Endereço

- Telefones (permitir múltiplos)

Clientes

Campos:

- CPF

- RG

- Nome

- Endereço

- Cidade

- Telefones

Cidades

Campos:

- Nome

- Estado

Funcionários

Campos:

- CPF

- RG

- Nome

- Endereço

- Telefone

- Salário

- Tipo

- Empresa

Serviços

Campos:

- Nome

- Preço por hora

- Tipo

Se o tipo for GUINDASTE exibir:

- Tamanho Base

- Altura

- Bônus

Se o tipo for TRANSPORTE exibir:

- Limite de carga

- Percentual de acréscimo

Pedidos

Na criação do pedido permitir:

Selecionar:

- Cliente

- Empresa

- Funcionário

- Cidade de origem

- Cidade de destino

Informar:

- Endereço de origem

- Endereço de destino

- Data da solicitação

- Data de resolução

- Aceito

Adicionar um ou mais serviços ao pedido.

Cada item do pedido deve permitir informar:

- Serviço

- Tempo de duração

- Acréscimo

- Bônus

O preço do item e o preço total são calculados automaticamente pelo banco de dados (triggers do PostgreSQL). Apenas exiba os valores retornados pelo Supabase. Nunca faça esse cálculo no frontend.

Utilize componentes modernos do shadcn/ui para tabelas, formulários, diálogos e botões.

Organize o código em componentes reutilizáveis.

Utilize React Hook Form para formulários.

Utilize Zod para validações.

Todas as consultas devem ser feitas diretamente no Supabase.

Não utilize dados mockados.

Não crie banco de dados nem migrações.

Consuma apenas o banco existente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b1238c3-86d8-428c-971e-cd64619961fc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
