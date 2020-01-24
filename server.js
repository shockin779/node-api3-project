const express = require('express');
const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}.`);
  next();
}

module.exports = server;
