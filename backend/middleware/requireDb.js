// Guard for routes that need MongoDB. When the database is down or was
// never configured, answer 503 with a plain message instead of letting
// Mongoose throw a confusing timeout error.

const { isDbConnected } = require('../db');

function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({
      error: 'Database unavailable — set MONGODB_URI and make sure MongoDB is reachable, then restart the server.',
    });
  }
  return next();
}

module.exports = { requireDb };
