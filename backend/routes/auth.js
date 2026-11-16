const express = require('express');
const User = require('../models/User');
const Player = require('../models/Player');
const { requireDb } = require('../middleware/requireDb');
const { requireAuth, signToken } = require('../middleware/auth');

const router = express.Router();

// All auth routes need the database except the 503 they return without it.
router.use(requireDb);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register { username, email, password, class? }
// Creates the account, a starter player profile, and returns a JWT.
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, class: playerClass } = req.body || {};

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET is not set' });
    }

    const taken = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.trim() }] });
    if (taken) {
      return res.status(409).json({ error: 'That username or email is already registered' });
    }

    const user = new User({ username: username.trim(), email: email.toLowerCase() });
    await user.setPassword(password);
    await user.save();

    const player = Player.newForUser(user._id, playerClass);
    await player.save();

    return res.status(201).json({
      token: signToken(user._id),
      user: user.toPublic(),
      player: player.toPublic(),
    });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/login { email | username, password } -> JWT + user + player
router.post('/login', async (req, res, next) => {
  try {
    const { email, username, password } = req.body || {};
    const login = (email || username || '').trim().toLowerCase();

    if (!login || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET is not set' });
    }

    const user = await User.findOne({
      $or: [{ email: login }, { username: req.body.username || login }],
    });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid login details' });
    }

    const player = await Player.findOne({ user: user._id });
    return res.json({
      token: signToken(user._id),
      user: user.toPublic(),
      player: player ? player.toPublic() : null,
    });
  } catch (err) {
    return next(err);
  }
});

// GET /api/auth/me — the logged-in account (Bearer token required).
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Account not found' });
    const player = await Player.findOne({ user: user._id });
    return res.json({ user: user.toPublic(), player: player ? player.toPublic() : null });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
