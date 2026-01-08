const express = require('express');
const { findUserByEmail, createUser, verifyPassword, findUserById } = require('./database');

const router = express.Router();

// Sign up endpoint
router.post('/signup', async (req, res) => {
  console.log('📝 Signup request received:', { username: req.body.username, email: req.body.email });
  
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: username, email, password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Validate username length
    if (username.length < 3) {
      console.log('❌ Username too short');
      return res.status(400).json({
        error: 'Username must be at least 3 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = await createUser(username, email, password);
    console.log('✅ User created successfully:', newUser.id);

    // Set session
    req.session.userId = newUser.id;
    
    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({ error: 'Session creation failed' });
      }

      console.log('✅ Session created for user:', newUser.id);
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          level: 'Beginner',
          onboarding_completed: 0
        }
      });
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
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
  console.log('🔐 Login request received:', { email: req.body.email });
  
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: email, password'
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Set session
    req.session.userId = user.id;
    
    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }

      console.log('✅ Login successful for user:', user.id);
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level || 'Beginner',
          learning_style: user.learning_style,
          interests: user.interests ? JSON.parse(user.interests) : [],
          preferred_method: user.preferred_method,
          onboarding_completed: user.onboarding_completed || 0
        }
      });
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  console.log('👋 Logout request for user:', req.session.userId);
  
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    console.log('✅ Logout successful');
    res.json({ message: 'Logout successful' });
  });
});

// Status endpoint - check if user is authenticated
router.get('/status', async (req, res) => {
  console.log('🔍 Auth status check, session userId:', req.session.userId);
  
  try {
    if (!req.session.userId) {
      console.log('❌ No session userId found');
      return res.json({ authenticated: false });
    }

    // Get full user details from database
    const user = await findUserById(req.session.userId);
    if (!user) {
      console.log('❌ User not found in database:', req.session.userId);
      return res.json({ authenticated: false });
    }

    console.log('✅ User authenticated:', user.id);
    res.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level || 'Beginner',
        learning_style: user.learning_style,
        interests: user.interests ? JSON.parse(user.interests) : [],
        preferred_method: user.preferred_method,
        onboarding_completed: user.onboarding_completed || 0
      }
    });
  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
