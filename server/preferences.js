const express = require('express');
const { updateUserPreferences, findUserById, getQuizHistory } = require('./database');

const router = express.Router();

// Save preferences
router.post('/save', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const { learning_style, interests, preferred_method } = req.body;

    if (!learning_style || !interests || !preferred_method) {
      return res.status(400).json({ error: 'Missing required preferences' });
    }

    await updateUserPreferences(
      req.session.userId,
      learning_style,
      interests,
      preferred_method
    );

    res.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Save preferences error:', error);
    res.status(500).json({ 
      error: 'Failed to save preferences',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user preferences
router.get('/user', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  try {
    const user = await findUserById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Parse interests from JSON string
    let interests = [];
    if (user.interests) {
      try {
        interests = JSON.parse(user.interests);
      } catch (e) {
        console.error('Failed to parse interests:', e);
      }
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      level: user.level,
      learning_style: user.learning_style,
      interests,
      preferred_method: user.preferred_method,
      onboarding_completed: user.onboarding_completed
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user profile data
router.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  try {
    const user = await findUserById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Parse interests from JSON string
    let interests = [];
    if (user.interests) {
      try {
        interests = JSON.parse(user.interests);
      } catch (e) {
        console.error('Failed to parse interests:', e);
      }
    }
    
    // Get quiz history
    const quizHistory = await getQuizHistory(req.session.userId);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        learning_style: user.learning_style,
        interests,
        preferred_method: user.preferred_method,
        onboarding_completed: user.onboarding_completed
      },
      quizHistory: quizHistory.slice(0, 5) // Last 5 quizzes
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
