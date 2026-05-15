const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const authorsService = require('../services/authorsService');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const authors = await authorsService.findAll();
    res.json(authors);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const author = await authorsService.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const existing = await authorsService.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const author = await authorsService.create({ name, email, bio });
    res.status(201).json(author);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const existing = await authorsService.findByEmail(email);
    if (existing && existing.id !== Number(req.params.id)) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const author = await authorsService.update(req.params.id, { name, email, bio });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await authorsService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(204).send();
  })
);

module.exports = router;
