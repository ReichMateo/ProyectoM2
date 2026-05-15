const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const postsService = require('../services/postsService');
const authorsService = require('../services/authorsService');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const posts = await postsService.findAll();
    res.json(posts);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await postsService.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  })
);

router.get(
  '/author/:authorId',
  asyncHandler(async (req, res) => {
    const author = await authorsService.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    const posts = await postsService.findByAuthor(req.params.authorId);
    res.json(posts);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id) {
      return res.status(400).json({ error: 'Title, content and author_id are required' });
    }
    const author = await authorsService.findById(author_id);
    if (!author) {
      return res.status(400).json({ error: 'Author does not exist' });
    }
    const post = await postsService.create({ title, content, author_id, published });
    res.status(201).json(post);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { title, content, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const post = await postsService.update(req.params.id, { title, content, published: published ?? false });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await postsService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).send();
  })
);

module.exports = router;
