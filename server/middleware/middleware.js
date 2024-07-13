const cors = require('cors');
const jwt = require('jsonwebtoken');

exports.setupMiddleware = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
};

exports.isLogedin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please sign in.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
