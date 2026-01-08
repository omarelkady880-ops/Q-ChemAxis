/**
 * QChemAxis Database Audit Script
 * 
 * Comprehensive audit tool for analyzing user accounts, detecting issues,
 * and providing detailed reports on database integrity.
 */

require('dotenv').config();
const { db } = require('./database');

class DatabaseAuditor {
  constructor() {
    this.issues = [];
    this.stats = {
      totalUsers: 0,
      duplicateEmails: 0,
      duplicateUsernames: 0,
      invalidPasswords: 0,
      missingFields: 0,
      corruptedEntries: 0,
      incompleteProfiles: 0
    };
  }

  /**
   * Run comprehensive database audit
   */
  async runAudit() {
    console.log('\n🔍 ===== QChemAxis Database Audit =====\n');
    console.log(`Audit started at: ${new Date().toISOString()}\n`);

    try {
      await this.checkDatabaseConnection();
      await this.auditUserAccounts();
      await this.checkDuplicates();
      await this.validateDataIntegrity();
      await this.checkQuizData();
      await this.generateReport();
      
      return {
        success: true,
        stats: this.stats,
        issues: this.issues
      };
    } catch (error) {
      console.error('❌ Audit failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check database connection and table existence
   */
  async checkDatabaseConnection() {
    console.log('📊 Checking database connection...');
    
    return new Promise((resolve, reject) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) {
          this.issues.push({
            severity: 'CRITICAL',
            type: 'CONNECTION',
            message: 'Database connection failed',
            error: err.message
          });
          reject(err);
        } else if (!row) {
          this.issues.push({
            severity: 'CRITICAL',
            type: 'SCHEMA',
            message: 'Users table does not exist'
          });
          reject(new Error('Users table not found'));
        } else {
          console.log('✅ Database connected, users table exists\n');
          resolve();
        }
      });
    });
  }

  /**
   * Audit all user accounts
   */
  async auditUserAccounts() {
    console.log('👥 Auditing user accounts...');
    
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          this.issues.push({
            severity: 'CRITICAL',
            type: 'QUERY',
            message: 'Failed to retrieve user accounts',
            error: err.message
          });
          reject(err);
          return;
        }

        this.stats.totalUsers = rows.length;
        console.log(`   Total users: ${rows.length}`);

        // Analyze each user
        rows.forEach((user, index) => {
          this.validateUser(user, index + 1);
        });

        console.log('✅ User account audit complete\n');
        resolve(rows);
      });
    });
  }

  /**
   * Validate individual user account
   */
  validateUser(user, userNumber) {
    const userIssues = [];

    // Check required fields
    if (!user.username || user.username.trim() === '') {
      userIssues.push('Missing or empty username');
      this.stats.missingFields++;
    }

    if (!user.email || user.email.trim() === '') {
      userIssues.push('Missing or empty email');
      this.stats.missingFields++;
    }

    if (!user.password_hash || user.password_hash.trim() === '') {
      userIssues.push('Missing or empty password hash');
      this.stats.invalidPasswords++;
    }

    // Validate email format
    if (user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        userIssues.push('Invalid email format');
        this.stats.missingFields++;
      }
    }

    // Check password hash format (bcrypt hashes start with $2b$ or $2a$)
    if (user.password_hash && !user.password_hash.startsWith('$2')) {
      userIssues.push('Invalid password hash format (not bcrypt)');
      this.stats.invalidPasswords++;
    }

    // Check for NULL or undefined values in critical fields
    if (user.id === null || user.id === undefined) {
      userIssues.push('Missing user ID');
      this.stats.corruptedEntries++;
    }

    // Check level field
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (user.level && !validLevels.includes(user.level)) {
      userIssues.push(`Invalid level: ${user.level}`);
      this.stats.corruptedEntries++;
    }

    // Check for incomplete profiles
    if (!user.learning_style || !user.preferred_method || user.onboarding_completed !== 1) {
      this.stats.incompleteProfiles++;
    }

    // Check interests field (should be valid JSON if present)
    if (user.interests) {
      try {
        JSON.parse(user.interests);
      } catch (e) {
        userIssues.push('Invalid JSON in interests field');
        this.stats.corruptedEntries++;
      }
    }

    // Log issues if found
    if (userIssues.length > 0) {
      this.issues.push({
        severity: 'WARNING',
        type: 'USER_VALIDATION',
        userId: user.id,
        username: user.username,
        email: user.email,
        issues: userIssues
      });
    }
  }

  /**
   * Check for duplicate emails and usernames
   */
  async checkDuplicates() {
    console.log('🔎 Checking for duplicates...');

    // Check duplicate emails
    await new Promise((resolve, reject) => {
      db.all(
        'SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length > 0) {
            this.stats.duplicateEmails = rows.length;
            rows.forEach(row => {
              this.issues.push({
                severity: 'HIGH',
                type: 'DUPLICATE',
                message: `Duplicate email found: ${row.email}`,
                count: row.count
              });
            });
            console.log(`   ⚠️  Found ${rows.length} duplicate email(s)`);
          } else {
            console.log('   ✅ No duplicate emails');
          }
          resolve();
        }
      );
    });

    // Check duplicate usernames
    await new Promise((resolve, reject) => {
      db.all(
        'SELECT username, COUNT(*) as count FROM users GROUP BY username HAVING count > 1',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length > 0) {
            this.stats.duplicateUsernames = rows.length;
            rows.forEach(row => {
              this.issues.push({
                severity: 'HIGH',
                type: 'DUPLICATE',
                message: `Duplicate username found: ${row.username}`,
                count: row.count
              });
            });
            console.log(`   ⚠️  Found ${rows.length} duplicate username(s)`);
          } else {
            console.log('   ✅ No duplicate usernames');
          }
          resolve();
        }
      );
    });

    console.log('✅ Duplicate check complete\n');
  }

  /**
   * Validate overall data integrity
   */
  async validateDataIntegrity() {
    console.log('🔐 Validating data integrity...');

    // Check for orphaned quiz results
    await new Promise((resolve, reject) => {
      db.all(
        `SELECT qr.id, qr.user_id 
         FROM quiz_results qr 
         LEFT JOIN users u ON qr.user_id = u.id 
         WHERE u.id IS NULL`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length > 0) {
            this.issues.push({
              severity: 'MEDIUM',
              type: 'ORPHANED_DATA',
              message: `Found ${rows.length} orphaned quiz results (no matching user)`,
              orphanedRecords: rows
            });
            console.log(`   ⚠️  Found ${rows.length} orphaned quiz result(s)`);
          } else {
            console.log('   ✅ No orphaned quiz results');
          }
          resolve();
        }
      );
    });

    console.log('✅ Data integrity check complete\n');
  }

  /**
   * Check quiz data statistics
   */
  async checkQuizData() {
    console.log('📝 Analyzing quiz data...');

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          COUNT(*) as total_quizzes,
          COUNT(DISTINCT user_id) as users_with_quizzes,
          AVG(score) as avg_score,
          MAX(score) as max_score,
          MIN(score) as min_score
         FROM quiz_results`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length > 0) {
            const stats = rows[0];
            console.log(`   Total quizzes taken: ${stats.total_quizzes || 0}`);
            console.log(`   Users with quizzes: ${stats.users_with_quizzes || 0}`);
            console.log(`   Average score: ${stats.avg_score ? stats.avg_score.toFixed(2) : 'N/A'}`);
            console.log(`   Score range: ${stats.min_score || 'N/A'} - ${stats.max_score || 'N/A'}`);
          }
          console.log('✅ Quiz data analysis complete\n');
          resolve();
        }
      );
    });
  }

  /**
   * Generate comprehensive audit report
   */
  generateReport() {
    console.log('\n📋 ===== AUDIT REPORT SUMMARY =====\n');
    
    console.log('📊 Statistics:');
    console.log(`   Total Users: ${this.stats.totalUsers}`);
    console.log(`   Duplicate Emails: ${this.stats.duplicateEmails}`);
    console.log(`   Duplicate Usernames: ${this.stats.duplicateUsernames}`);
    console.log(`   Invalid Passwords: ${this.stats.invalidPasswords}`);
    console.log(`   Missing Fields: ${this.stats.missingFields}`);
    console.log(`   Corrupted Entries: ${this.stats.corruptedEntries}`);
    console.log(`   Incomplete Profiles: ${this.stats.incompleteProfiles}`);

    console.log('\n🔍 Issues Found:');
    if (this.issues.length === 0) {
      console.log('   ✅ No issues found! Database is healthy.');
    } else {
      // Group by severity
      const critical = this.issues.filter(i => i.severity === 'CRITICAL');
      const high = this.issues.filter(i => i.severity === 'HIGH');
      const medium = this.issues.filter(i => i.severity === 'MEDIUM');
      const warning = this.issues.filter(i => i.severity === 'WARNING');

      if (critical.length > 0) {
        console.log(`   🚨 CRITICAL: ${critical.length} issue(s)`);
        critical.forEach(issue => {
          console.log(`      - ${issue.type}: ${issue.message}`);
        });
      }

      if (high.length > 0) {
        console.log(`   ⚠️  HIGH: ${high.length} issue(s)`);
        high.forEach(issue => {
          console.log(`      - ${issue.type}: ${issue.message}`);
        });
      }

      if (medium.length > 0) {
        console.log(`   ⚡ MEDIUM: ${medium.length} issue(s)`);
        medium.forEach(issue => {
          console.log(`      - ${issue.type}: ${issue.message}`);
        });
      }

      if (warning.length > 0) {
        console.log(`   💡 WARNING: ${warning.length} issue(s)`);
      }
    }

    console.log('\n✅ Audit completed at:', new Date().toISOString());
    console.log('=====================================\n');

    // Recommendations
    if (this.issues.length > 0) {
      console.log('💡 Recommendations:');
      if (this.stats.duplicateEmails > 0 || this.stats.duplicateUsernames > 0) {
        console.log('   - Run db-cleanup.js to remove duplicate accounts');
      }
      if (this.stats.corruptedEntries > 0 || this.stats.invalidPasswords > 0) {
        console.log('   - Run db-cleanup.js to fix corrupted entries');
      }
      if (this.stats.incompleteProfiles > 0) {
        console.log('   - Incomplete profiles are normal for new users');
      }
      console.log('');
    }
  }

  /**
   * List all users with details
   */
  async listAllUsers() {
    console.log('\n👥 ===== ALL USER ACCOUNTS =====\n');
    
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY id ASC', [], (err, rows) => {
        if (err) {
          console.error('❌ Failed to retrieve users:', err);
          reject(err);
          return;
        }

        if (rows.length === 0) {
          console.log('No users found in database.');
        } else {
          rows.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`   ID: ${user.id}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Level: ${user.level}`);
            console.log(`   Learning Style: ${user.learning_style || 'Not set'}`);
            console.log(`   Preferred Method: ${user.preferred_method || 'Not set'}`);
            console.log(`   Onboarding: ${user.onboarding_completed ? 'Complete' : 'Incomplete'}`);
            console.log(`   Created: ${user.created_at}`);
            console.log('');
          });
        }

        console.log('================================\n');
        resolve(rows);
      });
    });
  }
}

// Run audit if executed directly
if (require.main === module) {
  const auditor = new DatabaseAuditor();
  
  auditor.runAudit()
    .then(result => {
      if (result.success) {
        // List all users after audit
        return auditor.listAllUsers();
      }
    })
    .then(() => {
      console.log('🎉 Audit process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Audit process failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseAuditor;
