const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'livros.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    genero TEXT NOT NULL,
    preco REAL NOT NULL CHECK(preco >= 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK(estoque >= 0),
    ano_publicacao INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

const count = db.prepare('SELECT COUNT(*) AS total FROM livros').get().total;

if (count === 0) {
  const seed = db.prepare(`
    INSERT INTO livros (titulo, autor, genero, preco, estoque, ano_publicacao)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const livros = [
    ['Clean Code', 'Robert C. Martin', 'Tecnologia', 120.0, 12, 2008],
    ['The Pragmatic Programmer', 'Andrew Hunt', 'Tecnologia', 135.5, 8, 1999],
    ['Dom Casmurro', 'Machado de Assis', 'Romance', 35.9, 20, 1899],
    ['1984', 'George Orwell', 'Ficção', 42.5, 18, 1949],
    ['O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 55.0, 10, 1937],
    ['A Revolução dos Bichos', 'George Orwell', 'Ficção', 29.9, 25, 1945],
    ['JavaScript: The Good Parts', 'Douglas Crockford', 'Tecnologia', 75.0, 7, 2008],
    ['Código Limpo para Iniciantes', 'Ana Souza', 'Tecnologia', 49.9, 14, 2023],
    ['Mindset', 'Carol Dweck', 'Desenvolvimento Pessoal', 39.9, 9, 2006],
    ['Pai Rico, Pai Pobre', 'Robert Kiyosaki', 'Finanças', 44.9, 11, 1997]
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) seed.run(...item);
  });

  insertMany(livros);
}

module.exports = db;
