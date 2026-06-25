const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const routes = require('./routes/index');

// ── Body parser ──────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────────
app.use('/rest', routes);

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
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