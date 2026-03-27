const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

function validarLivro(body) {
  const erros = [];

  if (!body.titulo || typeof body.titulo !== 'string' || body.titulo.trim().length < 2) {
    erros.push('titulo é obrigatório e deve ter pelo menos 2 caracteres');
  }

  if (!body.autor || typeof body.autor !== 'string' || body.autor.trim().length < 2) {
    erros.push('autor é obrigatório e deve ter pelo menos 2 caracteres');
  }

  if (!body.genero || typeof body.genero !== 'string' || body.genero.trim().length < 2) {
    erros.push('genero é obrigatório');
  }

  if (body.preco === undefined || Number.isNaN(Number(body.preco)) || Number(body.preco) < 0) {
    erros.push('preco é obrigatório e deve ser um número maior ou igual a 0');
  }

  if (body.estoque === undefined || !Number.isInteger(Number(body.estoque)) || Number(body.estoque) < 0) {
    erros.push('estoque é obrigatório e deve ser um inteiro maior ou igual a 0');
  }

  if (
    body.ano_publicacao === undefined ||
    !Number.isInteger(Number(body.ano_publicacao)) ||
    Number(body.ano_publicacao) < 0 ||
    Number(body.ano_publicacao) > new Date().getFullYear()
  ) {
    erros.push('ano_publicacao é obrigatório e deve ser um ano válido');
  }

  return erros;
}

app.get('/', (_req, res) => {
  res.json({
    mensagem: 'API de Livros funcionando',
    endpoints: [
      'GET /api/livros',
      'GET /api/livros/:id',
      'POST /api/livros',
      'PUT /api/livros/:id',
      'DELETE /api/livros/:id'
    ]
  });
});

app.get('/api/livros', (req, res) => {
  try {
    const {
      genero,
      busca,
      preco_min,
      preco_max,
      ordenar = 'id',
      direcao = 'asc',
      pagina = 1,
      limite = 10
    } = req.query;

    const colunasPermitidas = ['id', 'titulo', 'autor', 'genero', 'preco', 'estoque', 'ano_publicacao', 'created_at'];
    const direcoesPermitidas = ['asc', 'desc'];

    const ordemFinal = colunasPermitidas.includes(String(ordenar)) ? String(ordenar) : 'id';
    const direcaoFinal = direcoesPermitidas.includes(String(direcao).toLowerCase()) ? String(direcao).toUpperCase() : 'ASC';

    const filtros = [];
    const params = [];

    if (genero) {
      filtros.push('genero = ?');
      params.push(genero);
    }

    if (busca) {
      filtros.push('(titulo LIKE ? OR autor LIKE ?)');
      params.push(`%${busca}%`, `%${busca}%`);
    }

    if (preco_min !== undefined) {
      filtros.push('preco >= ?');
      params.push(Number(preco_min));
    }

    if (preco_max !== undefined) {
      filtros.push('preco <= ?');
      params.push(Number(preco_max));
    }

    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
    const page = Math.max(1, Number(pagina) || 1);
    const limit = Math.max(1, Number(limite) || 10);
    const offset = (page - 1) * limit;

    const totalStmt = db.prepare(`SELECT COUNT(*) AS total FROM livros ${where}`);
    const { total } = totalStmt.get(...params);

    const stmt = db.prepare(`
      SELECT * FROM livros
      ${where}
      ORDER BY ${ordemFinal} ${direcaoFinal}
      LIMIT ? OFFSET ?
    `);

    const livros = stmt.all(...params, limit, offset);

    res.json({
      dados: livros,
      paginacao: {
        pagina_atual: page,
        itens_por_pagina: limit,
        total_itens: total,
        total_paginas: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar livros', detalhe: error.message });
  }
});

app.get('/api/livros/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const stmt = db.prepare('SELECT * FROM livros WHERE id = ?');
    const livro = stmt.get(id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json(livro);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar livro', detalhe: error.message });
  }
});

app.post('/api/livros', (req, res) => {
  try {
    const erros = validarLivro(req.body);
    if (erros.length) {
      return res.status(400).json({ erro: 'Dados inválidos', validacoes: erros });
    }

    const { titulo, autor, genero, preco, estoque, ano_publicacao } = req.body;

    const stmt = db.prepare(`
      INSERT INTO livros (titulo, autor, genero, preco, estoque, ano_publicacao)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      titulo.trim(),
      autor.trim(),
      genero.trim(),
      Number(preco),
      Number(estoque),
      Number(ano_publicacao)
    );

    const livroCriado = db.prepare('SELECT * FROM livros WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(livroCriado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar livro', detalhe: error.message });
  }
});

app.put('/api/livros/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const existente = db.prepare('SELECT * FROM livros WHERE id = ?').get(id);
    if (!existente) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    const erros = validarLivro(req.body);
    if (erros.length) {
      return res.status(400).json({ erro: 'Dados inválidos', validacoes: erros });
    }

    const { titulo, autor, genero, preco, estoque, ano_publicacao } = req.body;

    const stmt = db.prepare(`
      UPDATE livros
      SET titulo = ?, autor = ?, genero = ?, preco = ?, estoque = ?, ano_publicacao = ?
      WHERE id = ?
    `);

    stmt.run(
      titulo.trim(),
      autor.trim(),
      genero.trim(),
      Number(preco),
      Number(estoque),
      Number(ano_publicacao),
      id
    );

    const atualizado = db.prepare('SELECT * FROM livros WHERE id = ?').get(id);
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar livro', detalhe: error.message });
  }
});

app.delete('/api/livros/:id', (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const existente = db.prepare('SELECT * FROM livros WHERE id = ?').get(id);
    if (!existente) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    db.prepare('DELETE FROM livros WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar livro', detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
