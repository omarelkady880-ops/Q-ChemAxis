require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Import routers
const mistralRouter = require('./mistral-proxy.js');
const { router: authRouter } = require('./auth-jwt');
const quizRouter = require('./quiz');
const preferencesRouter = require('./preferences');
const adminRouter = require('./admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Session: ${req.session.userId || 'None'}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    session: req.session.userId || 'None'
  });
});

// API routes
app.use('/api/mistral', mistralRouter);
app.use('/api/auth', authRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ [SERVER] Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ [SERVER] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Load the database to ensure connection stays open
const { db } = require('./database');

// Start server
app.listen(PORT, () => {
  console.log(`🚀 [SERVER] QChem Axis server running on port ${PORT}`);
  console.log(`🚀 [SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 [SERVER] JWT secret configured: ${!!process.env.JWT_SECRET}`);
});

// Keep the process alive
process.stdin.resume();

module.exports = app;