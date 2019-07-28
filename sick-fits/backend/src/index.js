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
  }
  next();
});

// Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // If they are'nt logged in, skip this
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    '{id, permissions, email, name}'
  );
  req.user = user;
  next();
});

// Start server
server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  }, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
  });