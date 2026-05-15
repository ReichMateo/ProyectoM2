const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/authorsService');
jest.mock('../src/services/postsService');
jest.mock('../src/services/commentsService');

const authorsService = require('../src/services/authorsService');
const postsService = require('../src/services/postsService');

const author = {
  id: 1,
  name: 'Test Author',
  email: 'test-author@example.com',
  bio: 'Backend dev',
  created_at: '2026-05-15T00:00:00.000Z',
};

const post = {
  id: 1,
  title: 'Test Post',
  content: 'Hello world',
  published: true,
  author_id: 1,
  created_at: '2026-05-15T00:00:00.000Z',
};

describe('MiniBlog API basic flows', () => {
  beforeEach(() => {
    authorsService.findByEmail.mockResolvedValue(null);
    authorsService.create.mockResolvedValue(author);
    authorsService.findById.mockImplementation(async (id) => (Number(id) === author.id ? author : null));
    authorsService.remove.mockImplementation(async (id) => Number(id) !== 999999);

    postsService.findByAuthor.mockResolvedValue([post]);
    postsService.create.mockResolvedValue(post);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create author', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: author.name, email: author.email, bio: author.bio });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(author);
    expect(authorsService.findByEmail).toHaveBeenCalledWith(author.email);
  });

  test('get author by id', async () => {
    const response = await request(app).get(`/authors/${author.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(author);
  });

  test('create post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ title: post.title, content: post.content, author_id: post.author_id, published: post.published });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(post);
    expect(authorsService.findById).toHaveBeenCalledWith(post.author_id);
  });

  test('delete nonexistent author returns 404', async () => {
    const response = await request(app).delete('/authors/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Author not found');
  });

  test('list posts by author', async () => {
    const response = await request(app).get(`/posts/author/${author.id}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toEqual(post);
  });
});
