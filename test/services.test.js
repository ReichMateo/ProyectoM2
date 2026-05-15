jest.mock('../src/db', () => ({
  query: jest.fn(),
  pool: { end: jest.fn() },
}));

const db = require('../src/db');
const authorsService = require('../src/services/authorsService');
const postsService = require('../src/services/postsService');
const commentsService = require('../src/services/commentsService');

describe('Authors service', () => {
  const author = {
    id: 1,
    name: 'Test Author',
    email: 'author@example.com',
    bio: 'Developer',
    created_at: '2026-05-15T00:00:00.000Z',
  };

  afterEach(() => {
    db.query.mockReset();
  });

  test('findAll returns all authors', async () => {
    db.query.mockResolvedValueOnce({ rows: [author] });
    const result = await authorsService.findAll();

    expect(result).toEqual([author]);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('findById returns author when found', async () => {
    db.query.mockResolvedValueOnce({ rows: [author] });
    const result = await authorsService.findById(1);

    expect(result).toEqual(author);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM authors WHERE id = $1'), [1]);
  });

  test('findByEmail returns author when found', async () => {
    db.query.mockResolvedValueOnce({ rows: [author] });
    const result = await authorsService.findByEmail(author.email);

    expect(result).toEqual(author);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM authors WHERE email = $1'), [author.email]);
  });

  test('create returns newly created author', async () => {
    db.query.mockResolvedValueOnce({ rows: [author] });
    const result = await authorsService.create(author);

    expect(result).toEqual(author);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO authors'), [author.name, author.email, author.bio]);
  });

  test('update returns updated author', async () => {
    db.query.mockResolvedValueOnce({ rows: [author] });
    const result = await authorsService.update(1, author);

    expect(result).toEqual(author);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE authors SET'), [author.name, author.email, author.bio, 1]);
  });

  test('remove returns true when deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 });
    const result = await authorsService.remove(1);

    expect(result).toBe(true);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM authors WHERE id = $1'), [1]);
  });
});

describe('Posts service', () => {
  const post = {
    id: 1,
    title: 'Test Post',
    content: 'Hello world',
    published: true,
    author_id: 1,
    created_at: '2026-05-15T00:00:00.000Z',
  };

  afterEach(() => {
    db.query.mockReset();
  });

  test('findAll returns all posts', async () => {
    db.query.mockResolvedValueOnce({ rows: [post] });
    const result = await postsService.findAll();

    expect(result).toEqual([post]);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('findById returns post when found', async () => {
    db.query.mockResolvedValueOnce({ rows: [post] });
    const result = await postsService.findById(1);

    expect(result).toEqual(post);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM posts p'), [1]);
  });

  test('findByAuthor returns posts for author', async () => {
    db.query.mockResolvedValueOnce({ rows: [post] });
    const result = await postsService.findByAuthor(1);

    expect(result).toEqual([post]);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE p.author_id = $1'), [1]);
  });

  test('create returns newly created post', async () => {
    db.query.mockResolvedValueOnce({ rows: [post] });
    const result = await postsService.create(post);

    expect(result).toEqual(post);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO posts'), [post.title, post.content, post.author_id, post.published]);
  });

  test('update returns updated post', async () => {
    db.query.mockResolvedValueOnce({ rows: [post] });
    const result = await postsService.update(1, post);

    expect(result).toEqual(post);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE posts SET'), [post.title, post.content, post.published, 1]);
  });

  test('remove returns true when deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 });
    const result = await postsService.remove(1);

    expect(result).toBe(true);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM posts WHERE id = $1'), [1]);
  });
});

describe('Comments service', () => {
  const comment = {
    id: 1,
    post_id: 1,
    author_id: 1,
    content: 'Nice post',
    created_at: '2026-05-15T00:00:00.000Z',
  };

  afterEach(() => {
    db.query.mockReset();
  });

  test('findAll returns comments', async () => {
    db.query.mockResolvedValueOnce({ rows: [comment] });
    const result = await commentsService.findAll();

    expect(result).toEqual([comment]);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('FROM comments c'));
  });

  test('create returns newly created comment', async () => {
    db.query.mockResolvedValueOnce({ rows: [comment] });
    const result = await commentsService.create(comment);

    expect(result).toEqual(comment);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO comments'), [comment.post_id, comment.author_id, comment.content]);
  });
});
