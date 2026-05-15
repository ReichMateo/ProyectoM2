const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const commentsService = require('../services/commentsService');
const authorsService = require('../services/authorsService');
const postsService = require('../services/postsService');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const comments = await commentsService.findAll();
    res.json(comments);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { content, post_id, author_id } = req.body;
    if (!content || !post_id || !author_id) {
      return res.status(400).json({ error: 'Content, post_id and author_id are required' });
    }
    const post = await postsService.findById(post_id);
    if (!post) {
      return res.status(400).json({ error: 'Post does not exist' });
    }
    const author = await authorsService.findById(author_id);
    if (!author) {
      return res.status(400).json({ error: 'Author does not exist' });
    }
    const comment = await commentsService.create({ content, post_id, author_id });
    res.status(201).json(comment);
  })
);

module.exports = router;
