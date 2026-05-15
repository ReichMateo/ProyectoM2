const db = require('../db');

const findAll = async () => {
  const { rows } = await db.query(
    `SELECT p.id, p.title, p.content, p.published, p.author_id, p.created_at,
            a.name AS author_name, a.email AS author_email
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     ORDER BY p.id`
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT p.id, p.title, p.content, p.published, p.author_id, p.created_at,
            a.name AS author_name, a.email AS author_email
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const findByAuthor = async (authorId) => {
  const { rows } = await db.query(
    `SELECT p.id, p.title, p.content, p.published, p.author_id, p.created_at,
            a.name AS author_name, a.email AS author_email
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     WHERE p.author_id = $1
     ORDER BY p.id`,
    [authorId]
  );
  return rows;
};

const create = async ({ title, content, author_id, published }) => {
  const { rows } = await db.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, content, published, author_id, created_at`,
    [title, content, author_id, published || false]
  );
  return rows[0];
};

const update = async (id, { title, content, published }) => {
  const { rows } = await db.query(
    `UPDATE posts SET title = $1, content = $2, published = $3 WHERE id = $4
     RETURNING id, title, content, published, author_id, created_at`,
    [title, content, published, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM posts WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  findAll,
  findById,
  findByAuthor,
  create,
  update,
  remove,
};
