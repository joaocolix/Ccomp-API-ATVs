# API de Livros — Atividades de Desenvolvimento de Aplicativos Móveis

Este projeto foi montado para atender as atividades publicadas da disciplina **Desenvolvimento de Aplicativos Móveis — Criação de API REST Básica — CRUD com banco de dados**.

## O que foi coberto

### Aula 3 — GET
- `GET /api/livros`
- `GET /api/livros/:id`
- filtro por `genero`
- busca por `busca`
- filtro por `preco_min` e `preco_max`
- ordenação por `ordenar` e `direcao`
- paginação por `pagina` e `limite`

### Aula 4 — POST
- `POST /api/livros`
- validação completa dos dados
- retorno `201 Created`

### Aula 5 — PUT e DELETE
- `PUT /api/livros/:id`
- `DELETE /api/livros/:id`
- tratamento de `404` e `400`

### Aula 6 — Banco de dados
- SQLite com tabela `livros`
- operações CRUD em SQL
- 10 registros iniciais

### Aula 7 — Integração API + banco
- Express + SQLite
- prepared statements
- persistência real em `livros.db`

## Instalação

```bash
npm install
npm start
```

Servidor:

```bash
http://localhost:3000
```

## Endpoints

### 1) Listar todos
```http
GET /api/livros
```

Exemplo:
```http
GET /api/livros?genero=Tecnologia&ordenar=preco&direcao=asc&pagina=1&limite=5
```

Resposta:
```json
{
  "dados": [
    {
      "id": 8,
      "titulo": "Código Limpo para Iniciantes",
      "autor": "Ana Souza",
      "genero": "Tecnologia",
      "preco": 49.9,
      "estoque": 14,
      "ano_publicacao": 2023,
      "created_at": "2026-03-27 00:00:00"
    }
  ],
  "paginacao": {
    "pagina_atual": 1,
    "itens_por_pagina": 5,
    "total_itens": 3,
    "total_paginas": 1
  }
}
```

### 2) Buscar por ID
```http
GET /api/livros/:id
```

Exemplo:
```http
GET /api/livros/1
```

### 3) Criar livro
```http
POST /api/livros
Content-Type: application/json
```

Body:
```json
{
  "titulo": "Entendendo APIs REST",
  "autor": "Levi Santos",
  "genero": "Tecnologia",
  "preco": 59.9,
  "estoque": 15,
  "ano_publicacao": 2026
}
```

Resposta esperada: `201 Created`

### 4) Atualizar livro
```http
PUT /api/livros/1
Content-Type: application/json
```

Body:
```json
{
  "titulo": "Clean Code - Edição Revisada",
  "autor": "Robert C. Martin",
  "genero": "Tecnologia",
  "preco": 129.9,
  "estoque": 10,
  "ano_publicacao": 2008
}
```

### 5) Deletar livro
```http
DELETE /api/livros/1
```

Resposta esperada: `204 No Content`

## Validações implementadas
- `titulo` obrigatório, mínimo 2 caracteres
- `autor` obrigatório, mínimo 2 caracteres
- `genero` obrigatório
- `preco` numérico e maior ou igual a 0
- `estoque` inteiro e maior ou igual a 0
- `ano_publicacao` inteiro e válido
- `id` precisa ser inteiro positivo

## Estrutura

```text
api-livros/
├── src/
│   ├── database.js
│   └── index.js
├── docs/
│   └── atividades-resolvidas.md
├── postman/
│   └── api-livros.postman_collection.json
├── package.json
├── .gitignore
└── README.md
```
