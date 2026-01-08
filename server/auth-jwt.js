const express = require('express');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, verifyPassword, findUserById, emailExists } = require('./database');
const bcrypt = require('bcrypt');

const router = express.Router();

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: username, email, password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({
        error: 'Username must be at least 3 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = await createUser(username, email, password);

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        level: newUser.level,
        learning_style: newUser.learning_style,
        interests: newUser.interests ? JSON.parse(newUser.interests) : [],
        preferred_method: newUser.preferred_method,
        onboarding_completed: newUser.onboarding_completed
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({
        error: 'User with this email or username already exists'
      });
    }
    res.status(500).json({
      error: 'Internal server error during signup',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: email, password'
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        learning_style: user.learning_style,
        interests: user.interests ? JSON.parse(user.interests) : [],
        preferred_method: user.preferred_method,
        onboarding_completed: user.onboarding_completed
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logout successful' });
});

// Status endpoint - verify token and return user data
router.get('/status', authenticateToken, async (req, res) => {
  try {
    // Get full user details from database
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        learning_style: user.learning_style,
        interests: user.interests ? JSON.parse(user.interests) : [],
        preferred_method: user.preferred_method,
        onboarding_completed: user.onboarding_completed
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Refresh token endpoint (optional - for extending sessions)
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google Sign-In endpoint
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    // Validate required fields
    if (!email || !name || !googleId) {
      return res.status(400).json({
        error: 'Missing required fields: email, name, googleId'
      });
    }

    // Check if user already exists by email
    let user = await findUserByEmail(email);

    if (user) {
      // User exists, generate token
      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level,
          learning_style: user.learning_style,
          interests: user.interests ? JSON.parse(user.interests) : [],
          preferred_method: user.preferred_method,
          onboarding_completed: user.onboarding_completed
        }
      });
    } else {
      // User doesn't exist, create new account
      // Use name as username, but make sure it's unique
      let username = name;
      let counter = 1;
      while (await emailExists(username)) {
        username = `${name}${counter}`;
        counter++;
      }

      // Create a temporary password for Google users (not used)
      const tempPassword = bcrypt.hashSync(googleId, 10);

      const newUser = await createUser(username, email, tempPassword);

      // Generate JWT token
      const token = generateToken(newUser);

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          level: newUser.level || 'Beginner',
          learning_style: null,
          interests: [],
          preferred_method: null,
          onboarding_completed: newUser.onboarding_completed
        }
      });
    }

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      error: 'Internal server error during Google authentication',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = { router, authenticateToken };
