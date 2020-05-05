const express = require('express');
const postRouter = require('./postRouter.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.json({query: req.query, params: req.params, headers: req.headers});
});

server.use('/api/posts', postRouter)

server.listen(4444, () => {
  console.log('\n*** Server Running on http://localhost:4444 ***\n');
});