const db = require('../db');

const findAll = async () => {
  const { rows } = await db.query(
    `SELECT c.id, c.content, c.post_id, c.author_id, c.created_at,
            p.title AS post_title, a.name AS author_name
     FROM comments c
     JOIN posts p ON c.post_id = p.id
     JOIN authors a ON c.author_id = a.id
     ORDER BY c.id`
  );
  return rows;
};

const create = async ({ post_id, author_id, content }) => {
  const { rows } = await db.query(
    `INSERT INTO comments (post_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, author_id, content, created_at`,
    [post_id, author_id, content]
  );
  return rows[0];
};

module.exports = {
  findAll,
  create,
};
