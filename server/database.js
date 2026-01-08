const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'qvision.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      level TEXT DEFAULT 'Beginner',
      learning_style TEXT,
      interests TEXT,
      preferred_method TEXT,
      onboarding_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create quiz_results table
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      level TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('Database tables initialized successfully');
}

// Helper functions
const dbHelpers = {
  // Create a new user
  createUser: (username, email, password) => {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email });
          }
        }
      );
    });
  },

  // Find user by email
  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Find user by ID
  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Verify password
  verifyPassword: (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },

  // Update user level
  updateUserLevel: (userId, level) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET level = ? WHERE id = ?',
        [level, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  // Save quiz result
  saveQuizResult: (userId, score, level) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO quiz_results (user_id, score, level) VALUES (?, ?, ?)',
        [userId, score, level],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  // Get quiz history
  getQuizHistory: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM quiz_results WHERE user_id = ? ORDER BY timestamp DESC',
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  // Update user preferences
  updateUserPreferences: (userId, learningStyle, interests, preferredMethod) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET learning_style = ?, interests = ?, preferred_method = ?, onboarding_completed = 1 WHERE id = ?',
        [learningStyle, JSON.stringify(interests), preferredMethod, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  // === ENHANCED VALIDATION & MANAGEMENT FUNCTIONS ===

  // Find user by username
  findUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Get all users (admin function)
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, username, email, level, learning_style, preferred_method, onboarding_completed, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Parse interests field for each user
            const users = rows.map(user => ({
              ...user,
              interests: user.interests ? JSON.parse(user.interests) : []
            }));
            resolve(users);
          }
        }
      );
    });
  },

  // Get user count
  getUserCount: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  },

  // Get user statistics
  getUserStats: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          (SELECT COUNT(*) FROM quiz_results WHERE user_id = ?) as quizzes_taken,
          (SELECT AVG(score) FROM quiz_results WHERE user_id = ?) as avg_score,
          (SELECT MAX(score) FROM quiz_results WHERE user_id = ?) as best_score
        `,
        [userId, userId, userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const stats = rows[0] || { quizzes_taken: 0, avg_score: 0, best_score: 0 };
            resolve({
              quizzesTaken: stats.quizzes_taken || 0,
              avgScore: stats.avg_score ? parseFloat(stats.avg_score.toFixed(2)) : 0,
              bestScore: stats.best_score || 0,
              memoryUsage: Math.floor(Math.random() * 50) + 10 // Simulated for now
            });
          }
        }
      );
    });
  },

  // Delete user and all related data
  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Delete quiz results first (foreign key constraint)
        db.run('DELETE FROM quiz_results WHERE user_id = ?', [userId], (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Then delete user
          db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve({ deleted: this.changes > 0 });
            }
          });
        });
      });
    });
  },

  // Update user email
  updateUserEmail: (userId, newEmail) => {
    return new Promise((resolve, reject) => {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        reject(new Error('Invalid email format'));
        return;
      }

      db.run(
        'UPDATE users SET email = ? WHERE id = ?',
        [newEmail, userId],
        function(err) {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
              reject(new Error('Email already exists'));
            } else {
              reject(err);
            }
          } else {
            resolve({ updated: this.changes > 0 });
          }
        }
      );
    });
  },

  // Update username
  updateUsername: (userId, newUsername) => {
    return new Promise((resolve, reject) => {
      // Validate username
      if (!newUsername || newUsername.length < 3) {
        reject(new Error('Username must be at least 3 characters'));
        return;
      }

      db.run(
        'UPDATE users SET username = ? WHERE id = ?',
        [newUsername, userId],
        function(err) {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
              reject(new Error('Username already exists'));
            } else {
              reject(err);
            }
          } else {
            resolve({ updated: this.changes > 0 });
          }
        }
      );
    });
  },

  // Update user password
  updateUserPassword: (userId, newPassword) => {
    return new Promise((resolve, reject) => {
      // Validate password
      if (!newPassword || newPassword.length < 6) {
        reject(new Error('Password must be at least 6 characters'));
        return;
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      db.run(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedPassword, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ updated: this.changes > 0 });
          }
        }
      );
    });
  },

  // Check if email exists
  emailExists: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!!row);
          }
        }
      );
    });
  },

  // Check if username exists
  usernameExists: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!!row);
          }
        }
      );
    });
  },

  // Validate user credentials (returns user object or null)
  validateCredentials: async (email, password) => {
    try {
      const user = await dbHelpers.findUserByEmail(email);
      if (!user) return null;
      
      const isValid = dbHelpers.verifyPassword(password, user.password_hash);
      return isValid ? user : null;
    } catch (error) {
      throw error;
    }
  },

  // Get database health info
  getDatabaseHealth: () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        const health = {};

        // Count users
        db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
          if (err) {
            health.users = { error: err.message };
          } else {
            health.users = { count: row.count, status: 'OK' };
          }

          // Count quiz results
          db.get('SELECT COUNT(*) as count FROM quiz_results', [], (err, row) => {
            if (err) {
              health.quiz_results = { error: err.message };
            } else {
              health.quiz_results = { count: row.count, status: 'OK' };
            }

            // Check for orphaned data
            db.get(
              `SELECT COUNT(*) as count 
               FROM quiz_results qr 
               LEFT JOIN users u ON qr.user_id = u.id 
               WHERE u.id IS NULL`,
              [],
              (err, row) => {
                if (err) {
                  health.orphaned_data = { error: err.message };
                } else {
                  health.orphaned_data = { 
                    count: row.count, 
                    status: row.count > 0 ? 'WARNING' : 'OK' 
                  };
                }

                health.timestamp = new Date().toISOString();
                health.overall = (
                  health.users.status === 'OK' && 
                  health.quiz_results.status === 'OK' && 
                  health.orphaned_data.status === 'OK'
                ) ? 'HEALTHY' : 'NEEDS_ATTENTION';

                resolve(health);
              }
            );
          });
        });
      });
    });
  }
};

// Export both the database instance and helper functions
module.exports = {
  db,
  ...dbHelpers
};