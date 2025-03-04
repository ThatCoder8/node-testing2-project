const express = require('express');
const authRouter = require('./auth/auth-router');
const jokesRouter = require('./jokes/jokes-router');
const restricted = require('./auth/auth-middleware');

const server = express();

server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restricted, jokesRouter);

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
});

module.exports = server;