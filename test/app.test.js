const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

beforeAll(async () => {
  await db.query('CREATE TABLE IF NOT EXISTS authors (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(150) UNIQUE NOT NULL, bio TEXT, created_at TIMESTAMPTZ DEFAULT NOW())');
  await db.query('CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, content TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE, published BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())');
  await db.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE, author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE, content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())');
  await db.query('DELETE FROM comments');
  await db.query('DELETE FROM posts');
  await db.query('DELETE FROM authors');
});

afterAll(async () => {
  await db.pool.end();
});

describe('MiniBlog API basic flows', () => {
  let authorId;
  let postId;

  test('create author', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: 'Test Author', email: 'test-author@example.com', bio: 'Backend dev' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    authorId = response.body.id;
  });

  test('get author by id', async () => {
    const response = await request(app).get(`/authors/${authorId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Author');
  });

  test('create post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ title: 'Test Post', content: 'Hello world', author_id: authorId, published: true });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    postId = response.body.id;
  });

  test('delete nonexistent author returns 404', async () => {
    const response = await request(app).delete('/authors/999999');
    expect(response.status).toBe(404);
  });

  test('list posts by author', async () => {
    const response = await request(app).get(`/posts/author/${authorId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe('Test Post');
  });
});
