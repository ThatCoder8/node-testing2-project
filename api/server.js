const express = require('express');
const booksRouter = require('./books/books-router');

const server = express();

server.use(express.json());

server.use('/api/books', booksRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up and running' });
});

module.exports = server;
