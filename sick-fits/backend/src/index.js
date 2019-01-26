const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// Decode the JWT so we can get the user ID on each request

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { user } = jwt.verify(token, process.env.APP_SECRET);
    // Put the userId onto the req for future requests to access
    req.userId = user;
    console.log(user)
  }


  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  }, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
  });