/**
 * QChemAxis Admin Management Router
 * 
 * Endpoints for managing users and viewing system statistics.
 * These routes should be protected in production with admin authentication.
 */

const express = require('express');
const {
  getAllUsers,
  findUserById,
  getUserCount,
  getUserStats,
  deleteUser,
  updateUserEmail,
  updateUsername,
  updateUserPassword,
  updateUserLevel,
  getDatabaseHealth
} = require('./database');

const router = express.Router();

// Middleware to check if user is authenticated (basic check)
// In production, add proper admin role checking
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// === USER MANAGEMENT ENDPOINTS ===

/**
 * GET /api/admin/users
 * Get all users with their details
 */
router.get('/users', requireAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/users/:id
 * Get specific user details with stats
 */
router.get('/users/:id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await getUserStats(userId);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        learning_style: user.learning_style,
        interests: user.interests ? JSON.parse(user.interests) : [],
        preferred_method: user.preferred_method,
        onboarding_completed: user.onboarding_completed,
        created_at: user.created_at,
        stats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/stats
 * Get overall system statistics
 */
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userCount = await getUserCount();
    const health = await getDatabaseHealth();

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        databaseHealth: health
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/admin/users/:id/email
 * Update user email
 */
router.put('/users/:id/email', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { email } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await updateUserEmail(userId, email);

    res.json({
      success: true,
      message: 'Email updated successfully'
    });
  } catch (error) {
    console.error('Error updating email:', error);
    
    if (error.message.includes('Invalid email')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Failed to update email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/admin/users/:id/username
 * Update username
 */
router.put('/users/:id/username', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await updateUsername(userId, username);

    res.json({
      success: true,
      message: 'Username updated successfully'
    });
  } catch (error) {
    console.error('Error updating username:', error);
    
    if (error.message.includes('at least 3 characters')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Failed to update username',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/admin/users/:id/password
 * Reset user password (admin function)
 */
router.put('/users/:id/password', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { password } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    await updateUserPassword(userId, password);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    
    if (error.message.includes('at least 6 characters')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({
      error: 'Failed to update password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/admin/users/:id/level
 * Update user level
 */
router.put('/users/:id/level', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { level } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!level) {
      return res.status(400).json({ error: 'Level is required' });
    }

    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ 
        error: 'Invalid level. Must be one of: ' + validLevels.join(', ')
      });
    }

    await updateUserLevel(userId, level);

    res.json({
      success: true,
      message: 'Level updated successfully'
    });
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({
      error: 'Failed to update level',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user and all related data
 */
router.delete('/users/:id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Prevent deleting yourself (current logged-in user)
    if (userId === req.session.userId) {
      return res.status(403).json({ 
        error: 'Cannot delete your own account through admin panel' 
      });
    }

    const result = await deleteUser(userId);

    if (!result.deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/health
 * Get database health information
 */
router.get('/health', requireAuth, async (req, res) => {
  try {
    const health = await getDatabaseHealth();

    res.json({
      success: true,
      health: health
    });
  } catch (error) {
    console.error('Error checking health:', error);
    res.status(500).json({
      error: 'Failed to check database health',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/admin/users/:id/stats
 * Get detailed statistics for a specific user
 */
router.get('/users/:id/stats', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const stats = await getUserStats(userId);

    res.json({
      success: true,
      userId: userId,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
