// MongoDB connection helper.
//
// The server must still boot when no database is configured or reachable
// (for example, on a fresh checkout with only .env.example filled in).
// connectToDatabase() therefore never throws: it logs a clear warning and
// leaves mongoose disconnected. Routes that need the database answer
// 503 through requireDb() until a connection is up.

const mongoose = require('mongoose');

let lastError = null;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[db] MONGODB_URI is not set — database routes will answer 503 until it is configured. See .env.example.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');
    return true;
  } catch (err) {
    lastError = err;
    console.warn('[db] Could not connect to MongoDB:', err.message);
    console.warn('[db] Server will keep running; database routes will answer 503. Check MONGODB_URI.');
    return false;
  }
}

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function getLastError() {
  return lastError;
}

module.exports = { connectToDatabase, isDbConnected, getLastError };
