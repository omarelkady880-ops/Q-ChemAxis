/**
 * QChemAxis Database Cleanup Script
 * 
 * Automated cleanup tool for fixing corrupted data, removing duplicates,
 * and normalizing database entries.
 */

require('dotenv').config();
const { db } = require('./database');
const bcrypt = require('bcrypt');
const readline = require('readline');

class DatabaseCleaner {
  constructor(options = {}) {
    this.dryRun = options.dryRun !== false; // Default to dry run
    this.autoFix = options.autoFix || false;
    this.changes = [];
  }

  /**
   * Run comprehensive database cleanup
   */
  async runCleanup() {
    console.log('\n🧹 ===== QChemAxis Database Cleanup =====\n');
    console.log(`Mode: ${this.dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}`);
    console.log(`Started at: ${new Date().toISOString()}\n`);

    try {
      await this.removeDuplicateEmails();
      await this.removeDuplicateUsernames();
      await this.fixCorruptedPasswords();
      await this.normalizeUserFields();
      await this.removeOrphanedData();
      await this.fixInvalidEmails();
      await this.generateReport();

      return {
        success: true,
        changes: this.changes,
        dryRun: this.dryRun
      };
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove duplicate email accounts (keep oldest)
   */
  async removeDuplicateEmails() {
    console.log('📧 Checking for duplicate emails...');

    return new Promise((resolve, reject) => {
      // Find duplicate emails
      db.all(
        `SELECT email, GROUP_CONCAT(id) as ids, COUNT(*) as count 
         FROM users 
         GROUP BY email 
         HAVING count > 1`,
        [],
        async (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            console.log('   ✅ No duplicate emails found\n');
            resolve();
            return;
          }

          console.log(`   Found ${rows.length} duplicate email(s)`);

          for (const row of rows) {
            const ids = row.ids.split(',').map(id => parseInt(id));
            const keepId = Math.min(...ids); // Keep oldest (lowest ID)
            const removeIds = ids.filter(id => id !== keepId);

            console.log(`   - Email: ${row.email}`);
            console.log(`     Keeping ID: ${keepId}, Removing IDs: ${removeIds.join(', ')}`);

            this.changes.push({
              type: 'DUPLICATE_EMAIL',
              email: row.email,
              kept: keepId,
              removed: removeIds
            });

            if (!this.dryRun) {
              // Delete duplicate accounts
              for (const id of removeIds) {
                await this.deleteUser(id);
              }
            }
          }

          console.log('   ✅ Duplicate email cleanup complete\n');
          resolve();
        }
      );
    });
  }

  /**
   * Remove duplicate username accounts (keep oldest)
   */
  async removeDuplicateUsernames() {
    console.log('👤 Checking for duplicate usernames...');

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT username, GROUP_CONCAT(id) as ids, COUNT(*) as count 
         FROM users 
         GROUP BY username 
         HAVING count > 1`,
        [],
        async (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            console.log('   ✅ No duplicate usernames found\n');
            resolve();
            return;
          }

          console.log(`   Found ${rows.length} duplicate username(s)`);

          for (const row of rows) {
            const ids = row.ids.split(',').map(id => parseInt(id));
            const keepId = Math.min(...ids); // Keep oldest
            const removeIds = ids.filter(id => id !== keepId);

            console.log(`   - Username: ${row.username}`);
            console.log(`     Keeping ID: ${keepId}, Removing IDs: ${removeIds.join(', ')}`);

            this.changes.push({
              type: 'DUPLICATE_USERNAME',
              username: row.username,
              kept: keepId,
              removed: removeIds
            });

            if (!this.dryRun) {
              for (const id of removeIds) {
                await this.deleteUser(id);
              }
            }
          }

          console.log('   ✅ Duplicate username cleanup complete\n');
          resolve();
        }
      );
    });
  }

  /**
   * Fix corrupted password hashes
   */
  async fixCorruptedPasswords() {
    console.log('🔐 Checking for corrupted password hashes...');

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, username, email, password_hash 
         FROM users 
         WHERE password_hash IS NULL 
            OR password_hash = '' 
            OR (password_hash NOT LIKE '$2%' AND password_hash NOT LIKE '$2a$%' AND password_hash NOT LIKE '$2b$%')`,
        [],
        async (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            console.log('   ✅ No corrupted password hashes found\n');
            resolve();
            return;
          }

          console.log(`   Found ${rows.length} corrupted password hash(es)`);

          for (const user of rows) {
            console.log(`   - User ID ${user.id} (${user.username}): Invalid password hash`);
            
            // Generate a random temporary password
            const tempPassword = Math.random().toString(36).slice(-10);
            const newHash = bcrypt.hashSync(tempPassword, 10);

            this.changes.push({
              type: 'CORRUPTED_PASSWORD',
              userId: user.id,
              username: user.username,
              email: user.email,
              action: 'Reset to temporary password',
              tempPassword: tempPassword // Only for dry run reporting
            });

            if (!this.dryRun) {
              await this.updatePasswordHash(user.id, newHash);
              console.log(`     ✅ Reset password to temporary: ${tempPassword}`);
            }
          }

          console.log('   ✅ Password hash cleanup complete\n');
          resolve();
        }
      );
    });
  }

  /**
   * Normalize user fields (set defaults for NULL values)
   */
  async normalizeUserFields() {
    console.log('🔧 Normalizing user fields...');

    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', [], async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        let normalized = 0;

        for (const user of rows) {
          const updates = [];
          const changes = [];

          // Normalize level
          if (!user.level || !['Beginner', 'Intermediate', 'Advanced'].includes(user.level)) {
            updates.push("level = 'Beginner'");
            changes.push('level → Beginner');
          }

          // Normalize onboarding_completed
          if (user.onboarding_completed === null || user.onboarding_completed === undefined) {
            updates.push('onboarding_completed = 0');
            changes.push('onboarding_completed → 0');
          }

          // If there are updates needed
          if (updates.length > 0) {
            normalized++;
            console.log(`   - User ID ${user.id} (${user.username}): ${changes.join(', ')}`);

            this.changes.push({
              type: 'NORMALIZE_FIELDS',
              userId: user.id,
              username: user.username,
              changes: changes
            });

            if (!this.dryRun) {
              await this.executeUpdate(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [user.id]);
            }
          }
        }

        if (normalized === 0) {
          console.log('   ✅ No normalization needed\n');
        } else {
          console.log(`   ✅ Normalized ${normalized} user(s)\n`);
        }

        resolve();
      });
    });
  }

  /**
   * Remove orphaned quiz results (no matching user)
   */
  async removeOrphanedData() {
    console.log('🗑️  Checking for orphaned quiz results...');

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT qr.id, qr.user_id 
         FROM quiz_results qr 
         LEFT JOIN users u ON qr.user_id = u.id 
         WHERE u.id IS NULL`,
        [],
        async (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            console.log('   ✅ No orphaned quiz results found\n');
            resolve();
            return;
          }

          console.log(`   Found ${rows.length} orphaned quiz result(s)`);

          for (const row of rows) {
            console.log(`   - Quiz ID ${row.id} (user_id: ${row.user_id})`);

            this.changes.push({
              type: 'ORPHANED_DATA',
              quizId: row.id,
              userId: row.user_id
            });

            if (!this.dryRun) {
              await this.executeUpdate('DELETE FROM quiz_results WHERE id = ?', [row.id]);
            }
          }

          console.log('   ✅ Orphaned data cleanup complete\n');
          resolve();
        }
      );
    });
  }

  /**
   * Fix invalid email formats
   */
  async fixInvalidEmails() {
    console.log('📧 Checking for invalid email formats...');

    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, email FROM users', [], async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let invalid = 0;

        for (const user of rows) {
          if (user.email && !emailRegex.test(user.email)) {
            invalid++;
            console.log(`   - User ID ${user.id} (${user.username}): Invalid email "${user.email}"`);

            this.changes.push({
              type: 'INVALID_EMAIL',
              userId: user.id,
              username: user.username,
              email: user.email,
              action: 'Account flagged for manual review'
            });
          }
        }

        if (invalid === 0) {
          console.log('   ✅ All emails are valid\n');
        } else {
          console.log(`   ⚠️  Found ${invalid} invalid email(s) - manual review required\n`);
        }

        resolve();
      });
    });
  }

  /**
   * Delete user and all related data
   */
  async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Delete quiz results
        db.run('DELETE FROM quiz_results WHERE user_id = ?', [userId], (err) => {
          if (err) console.error(`Error deleting quiz results for user ${userId}:`, err);
        });

        // Delete user
        db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Update password hash
   */
  async updatePasswordHash(userId, newHash) {
    return this.executeUpdate('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
  }

  /**
   * Execute SQL update query
   */
  async executeUpdate(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  /**
   * Generate cleanup report
   */
  generateReport() {
    console.log('\n📋 ===== CLEANUP REPORT =====\n');
    
    if (this.changes.length === 0) {
      console.log('✅ No issues found - database is clean!\n');
      return;
    }

    console.log(`Total changes identified: ${this.changes.length}\n`);

    // Group by type
    const byType = {};
    this.changes.forEach(change => {
      if (!byType[change.type]) byType[change.type] = [];
      byType[change.type].push(change);
    });

    Object.keys(byType).forEach(type => {
      console.log(`${type}: ${byType[type].length} item(s)`);
    });

    if (this.dryRun) {
      console.log('\n⚠️  This was a DRY RUN - no changes were applied');
      console.log('To apply changes, run: node db-cleanup.js --live');
    } else {
      console.log('\n✅ All changes have been applied successfully');
    }

    console.log('\n============================\n');
  }
}

/**
 * Interactive mode - ask user for confirmation
 */
async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n🧹 QChemAxis Database Cleanup Tool\n');
    console.log('This tool will:');
    console.log('  • Remove duplicate accounts');
    console.log('  • Fix corrupted password hashes');
    console.log('  • Normalize user fields');
    console.log('  • Remove orphaned data');
    console.log('  • Validate email formats\n');

    rl.question('Run in DRY RUN mode first? (recommended) [Y/n]: ', (answer) => {
      const dryRun = !answer || answer.toLowerCase() === 'y';
      rl.close();
      
      const cleaner = new DatabaseCleaner({ dryRun });
      cleaner.runCleanup()
        .then(result => {
          if (result.success && dryRun && result.changes.length > 0) {
            console.log('\n💡 To apply these changes, run: node db-cleanup.js --live\n');
          }
          resolve(result);
        });
    });
  });
}

// Run cleanup if executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--live') || args.includes('-l')) {
    // Live mode
    const cleaner = new DatabaseCleaner({ dryRun: false });
    cleaner.runCleanup()
      .then(result => {
        if (result.success) {
          console.log('🎉 Cleanup completed successfully!');
          process.exit(0);
        } else {
          console.error('💥 Cleanup failed');
          process.exit(1);
        }
      });
  } else if (args.includes('--dry-run') || args.includes('-d')) {
    // Dry run mode
    const cleaner = new DatabaseCleaner({ dryRun: true });
    cleaner.runCleanup()
      .then(() => {
        console.log('🎉 Dry run completed!');
        process.exit(0);
      });
  } else {
    // Interactive mode
    runInteractive()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('💥 Cleanup failed:', error);
        process.exit(1);
      });
  }
}

module.exports = DatabaseCleaner;
