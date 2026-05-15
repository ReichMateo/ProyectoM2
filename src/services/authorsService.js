const db = require('../db');

const findAll = async () => {
  const { rows } = await db.query('SELECT id, name, email, bio, created_at FROM authors ORDER BY id');
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query('SELECT id, name, email, bio, created_at FROM authors WHERE id = $1', [id]);
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT id, email FROM authors WHERE email = $1', [email]);
  return rows[0] || null;
};

const create = async ({ name, email, bio }) => {
  const { rows } = await db.query(
    'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id, name, email, bio, created_at',
    [name, email, bio || null]
  );
  return rows[0];
};

const update = async (id, { name, email, bio }) => {
  const { rows } = await db.query(
    `UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING id, name, email, bio, created_at`,
    [name, email, bio || null, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM authors WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
};
