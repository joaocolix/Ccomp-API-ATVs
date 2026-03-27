# Atividades resolvidas

## Aula 3 — Atividade prática em sala
### O pedido da aula
- criar projeto `api-produtos`
- criar array com pelo menos 5 itens
- implementar `GET /api/produtos`
- implementar `GET /api/produtos/:id`
- adicionar filtro por categoria
- adicionar ordenação por preço
- testar no Postman

### Como foi atendido neste projeto
- projeto criado como `api-livros`
- possui mais de 10 registros iniciais
- possui `GET /api/livros`
- possui `GET /api/livros/:id`
- filtro por `genero`
- ordenação por `preco`
- ainda inclui busca e paginação como bônus

## Aula 3 — Desafio extra
- filtro por faixa de preço
- busca por nome
- paginação básica

### Implementado
- `preco_min`
- `preco_max`
- `busca`
- `pagina`
- `limite`

## Aula 4 — Trabalho 1
### Requisitos publicados
- documentar todos os endpoints GET e POST
- informar método, URL, body e resposta
- exemplos no Postman
- explicar validações
- criar pelo menos 5 recursos via POST

### Entrega equivalente neste pacote
- `README.md` documenta GET e POST
- collection do Postman em `postman/api-livros.postman_collection.json`
- validações descritas no README
- endpoint POST pronto para criação de múltiplos registros

## Aula 5 — Trabalho 2
### Requisitos publicados
- API CRUD completa
- tema livre
- mínimo 10 registros iniciais
- GET, POST, PUT e DELETE
- validações completas
- tratamento de erros
- README e collection

### Entrega equivalente neste pacote
- tema: livros
- 10 registros iniciais no SQLite
- CRUD completo
- validações completas
- respostas 400, 404, 500 e 204
- README completo
- collection Postman pronta

## Aula 6 — Exercício prático
### Pedido da aula
1. criar banco `produtos.db`
2. criar tabela
3. inserir 3 produtos
4. fazer SELECT
5. atualizar preço
6. deletar um produto

### Como foi atendido
- banco criado como `livros.db`
- tabela `livros` criada automaticamente
- seed com 10 livros
- SELECT é usado no GET
- UPDATE é usado no PUT
- DELETE é usado no DELETE

## Aula 7 — Para casa
### Pedido da aula
- migrar PUT com UPDATE
- migrar DELETE
- testar CRUD completo
- verificar persistência
- collection Postman completa

### Como foi atendido
- PUT usa `UPDATE livros SET ... WHERE id = ?`
- DELETE usa `DELETE FROM livros WHERE id = ?`
- CRUD completo pronto
- persistência via SQLite
- collection inclusa
