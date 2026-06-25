const express = require('express');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple')(session);
const { pool } = require('./config/db');
require('dotenv').config();

const app = express();

// ── Body parser ──────────────────────────────────────────
app.use(express.json());

// ── Session (cookie-based auth) ──────────────────────────
app.use(session({
  store: new connectPgSimple({
    pool,
    tableName: 'session'        // auto-created by connect-pg-simple
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

// ── Routes ───────────────────────────────────────────────
// will be wired here after routes are built
// const routes = require('./routes/index');
// app.use('/rest', routes);

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = app;