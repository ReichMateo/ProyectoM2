const express = require('express');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'MiniBlog API is running' });
});

app.use(errorHandler);

module.exports = app;
