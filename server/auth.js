const express = require('express');
const { findUserByEmail, createUser, verifyPassword, findUserById, emailExists } = require('./database');
const bcrypt = require('bcrypt');

const router = express.Router();

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

    // Set session
    req.session.userId = newUser.id;

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
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

    // Set session
    req.session.userId = user.id;

    res.json({
      message: 'Login successful',
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

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Status endpoint - check if user is authenticated
router.get('/status', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ authenticated: false });
    }

    // Get full user details from database
    const user = await findUserById(req.session.userId);
    if (!user) {
      return res.json({ authenticated: false });
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
        // User exists, log them in
        req.session.userId = user.id;
        
        res.json({
          message: 'Login successful',
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
        
        // Set session
        req.session.userId = newUser.id;
        
        res.status(201).json({
          message: 'Account created successfully',
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

module.exports = router;
