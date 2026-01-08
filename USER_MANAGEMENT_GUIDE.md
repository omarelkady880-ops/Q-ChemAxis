# QChemAxis User Management & Database Administration Guide

## 📋 Overview

This guide provides comprehensive instructions for managing user accounts, maintaining database integrity, and ensuring seamless authentication in the QChemAxis platform.

---

## 🛠️ Tools Available

### 1. Database Audit Tool (`db-audit.js`)
**Purpose**: Analyze database health and identify issues
**Location**: `server/db-audit.js`

**Features**:
- Check database connection and schema
- Validate user accounts (email, password, username)
- Detect duplicate emails/usernames
- Find corrupted or incomplete entries
- Check for orphaned quiz results
- Generate comprehensive health report

**Usage**:
```bash
node server/db-audit.js
```

**Output**: Detailed report showing:
- Total users
- Issues found (categorized by severity)
- Statistics on duplicates, invalid data, incomplete profiles
- Recommendations for cleanup

---

### 2. Database Cleanup Tool (`db-cleanup.js`)
**Purpose**: Fix corrupted data and remove duplicates
**Location**: `server/db-cleanup.js`

**Features**:
- Remove duplicate accounts (keeps oldest)
- Fix corrupted password hashes
- Normalize user fields (set defaults)
- Remove orphaned quiz results
- Validate email formats

**Usage**:

**Dry Run (recommended first)**:
```bash
node server/db-cleanup.js --dry-run
# OR interactive mode:
node server/db-cleanup.js
```

**Live Mode (apply changes)**:
```bash
node server/db-cleanup.js --live
```

**Output**: Report showing all changes made/proposed

---

### 3. Test User Setup (`auto-setup-user.js`)
**Purpose**: Create/verify test user account
**Location**: `server/auto-setup-user.js`

**Test Credentials**:
- Username: `omar khalid`
- Email: `omarelkady880@gmail.com`
- Password: `66276627`

**Usage**:
```bash
node server/auto-setup-user.js
```

---

### 4. Authentication Test Suite (`test-auth.js`)
**Purpose**: Comprehensive testing of all authentication flows
**Location**: `server/test-auth.js`

**Test Coverage**:
- Server health check
- User registration (valid/invalid cases)
- User login (success/failure scenarios)
- Authentication status checking
- Admin endpoints (user management)
- Logout functionality
- Edge cases (SQL injection, XSS, unicode, etc.)

**Usage**:

**Run all tests**:
```bash
node server/test-auth.js
```

**Run specific test suites**:
```bash
node server/test-auth.js --basic    # Auth tests only
node server/test-auth.js --admin    # Admin endpoints only
```

**Output**: Detailed test results with pass/fail counts and recommendations

---

## 🔧 Enhanced Database Functions

### New Functions Added to `database.js`:

#### User Management:
- `findUserByUsername(username)` - Find user by username
- `getAllUsers()` - Get all users (admin function)
- `getUserCount()` - Get total user count
- `getUserStats(userId)` - Get user statistics (quizzes, scores, memory)
- `deleteUser(userId)` - Delete user and related data

#### User Updates:
- `updateUserEmail(userId, newEmail)` - Update email with validation
- `updateUsername(userId, newUsername)` - Update username with validation
- `updateUserPassword(userId, newPassword)` - Update password with hashing

#### Validation:
- `emailExists(email)` - Check if email is already registered
- `usernameExists(username)` - Check if username is taken
- `validateCredentials(email, password)` - Validate login credentials

#### System Health:
- `getDatabaseHealth()` - Get database health info (users, quiz results, orphaned data)

---

## 🌐 Admin API Endpoints

All admin endpoints require authentication. Access via `/api/admin/*`

### User Management:

#### Get All Users
```http
GET /api/admin/users
Authorization: Session cookie required

Response:
{
  "success": true,
  "count": 5,
  "users": [...]
}
```

#### Get Specific User
```http
GET /api/admin/users/:id
Authorization: Session cookie required

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "username": "omar khalid",
    "email": "omarelkady880@gmail.com",
    "level": "Beginner",
    "stats": { ... }
  }
}
```

#### Update User Email
```http
PUT /api/admin/users/:id/email
Authorization: Session cookie required
Body: { "email": "newemail@example.com" }
```

#### Update Username
```http
PUT /api/admin/users/:id/username
Authorization: Session cookie required
Body: { "username": "newusername" }
```

#### Update User Password
```http
PUT /api/admin/users/:id/password
Authorization: Session cookie required
Body: { "password": "newpassword123" }
```

#### Update User Level
```http
PUT /api/admin/users/:id/level
Authorization: Session cookie required
Body: { "level": "Intermediate" }
Valid levels: Beginner, Intermediate, Advanced
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Session cookie required

Note: Cannot delete your own account
```

### System Monitoring:

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Session cookie required

Response:
{
  "success": true,
  "stats": {
    "totalUsers": 5,
    "databaseHealth": { ... }
  }
}
```

#### Get Database Health
```http
GET /api/admin/health
Authorization: Session cookie required

Response:
{
  "success": true,
  "health": {
    "users": { "count": 5, "status": "OK" },
    "quiz_results": { "count": 10, "status": "OK" },
    "orphaned_data": { "count": 0, "status": "OK" },
    "overall": "HEALTHY"
  }
}
```

#### Get User Statistics
```http
GET /api/admin/users/:id/stats
Authorization: Session cookie required

Response:
{
  "success": true,
  "stats": {
    "quizzesTaken": 5,
    "avgScore": 82.5,
    "bestScore": 95,
    "memoryUsage": 25
  }
}
```

---

## 📊 User Dashboard Integration

The UserDashboard component now fetches **real statistics** from the backend:

### Features:
- **Real-time data**: Fetches stats from `/api/admin/users/:id/stats`
- **Loading states**: Shows "Loading..." while fetching
- **Quiz statistics**: Displays quizzes taken, average score, best score
- **Memory usage**: Shows memory consumption with progress bar
- **Plan type**: Shows Free/Pro status based on user level

### Stats Displayed:
1. **Level**: User's current level (Beginner/Intermediate/Advanced)
2. **Plan**: Free or Pro (Pro = Advanced level)
3. **Memory**: Usage in MB with visual progress bar
4. **Quizzes**: Count with average and best scores

---

## 🚀 Step-by-Step Usage Guide

### **Scenario 1: Initial Setup**

1. **Check server is running**:
   ```bash
   npm run dev
   # Backend should start on port 3001
   ```

2. **Create test user**:
   ```bash
   node server/auto-setup-user.js
   ```

3. **Run database audit**:
   ```bash
   node server/db-audit.js
   ```

4. **Test authentication**:
   ```bash
   node server/test-auth.js
   ```

---

### **Scenario 2: Database Has Issues**

1. **Audit database first**:
   ```bash
   node server/db-audit.js
   ```
   
   Review the output for:
   - Duplicate accounts
   - Corrupted passwords
   - Invalid emails
   - Orphaned data

2. **Run cleanup in dry-run mode**:
   ```bash
   node server/db-cleanup.js --dry-run
   ```
   
   Review proposed changes carefully

3. **Apply fixes**:
   ```bash
   node server/db-cleanup.js --live
   ```

4. **Verify fixes**:
   ```bash
   node server/db-audit.js
   ```

5. **Test authentication works**:
   ```bash
   node server/test-auth.js
   ```

---

### **Scenario 3: User Account Issues**

#### Problem: User can't log in

**Solution 1: Check account exists**
```bash
node server/db-audit.js
# Look for the user in the output
```

**Solution 2: Reset password (via admin endpoint)**
```bash
# Login as admin first, then:
curl -X PUT http://localhost:3001/api/admin/users/USER_ID/password \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{"password": "newpassword123"}'
```

**Solution 3: Check for corruption**
```bash
node server/db-audit.js
# Look for "Invalid password hash" warnings
# If found, run cleanup:
node server/db-cleanup.js --live
```

#### Problem: Duplicate accounts

**Solution**:
```bash
# Cleanup tool will keep the oldest account
node server/db-cleanup.js --live
```

---

### **Scenario 4: Testing New Features**

1. **Run full test suite**:
   ```bash
   node server/test-auth.js
   ```

2. **Check specific functionality**:
   ```bash
   # Test basic auth only
   node server/test-auth.js --basic
   
   # Test admin endpoints only
   node server/test-auth.js --admin
   ```

3. **Monitor database health**:
   ```bash
   node server/db-audit.js
   ```

---

## 🔒 Security Best Practices

### Password Management:
- ✅ Passwords are hashed with bcrypt (cost factor: 10)
- ✅ Minimum 6 characters required
- ✅ Password hashes stored in `password_hash` field
- ✅ Plain passwords never stored or logged

### Session Management:
- ✅ Session-based authentication (express-session)
- ✅ HttpOnly cookies (prevents XSS)
- ✅ 24-hour session expiry
- ✅ SameSite: lax (CSRF protection)

### Input Validation:
- ✅ Email format validation (regex)
- ✅ Username length: minimum 3 characters
- ✅ Password length: minimum 6 characters
- ✅ SQL injection protection (prepared statements)
- ✅ Unique constraints on email/username

### Admin Protection:
- ✅ Admin endpoints require authentication
- ✅ Cannot delete your own account via admin panel
- ✅ All actions logged with timestamps
- ⚠️ **TODO**: Add role-based access control (RBAC)

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution**:
1. Check if `qvision.db` exists in `server/` directory
2. Ensure SQLite3 is installed: `npm install sqlite3`
3. Check file permissions

### Issue: "Users table does not exist"
**Solution**:
1. Start the server once to initialize tables: `npm run dev`
2. Check `database.js` initialization code

### Issue: "Session cookie not being set"
**Solution**:
1. Ensure `SESSION_SECRET` is set in `.env`
2. Check CORS configuration allows credentials
3. Verify frontend sends `credentials: 'include'`

### Issue: "All tests failing"
**Solution**:
1. Ensure server is running: `npm run dev`
2. Check server is on port 3001
3. Verify database is not locked

### Issue: "Orphaned quiz results"
**Solution**:
```bash
node server/db-cleanup.js --live
# This will remove quiz results for deleted users
```

---

## 📈 Monitoring & Maintenance

### Daily Checks:
- Monitor user registration rate
- Check for failed login attempts
- Review database health status

### Weekly Tasks:
```bash
# Run database audit
node server/db-audit.js

# Run authentication tests
node server/test-auth.js

# Check logs for errors
# Review server/qvision.db size
```

### Monthly Tasks:
- Review and clean up test accounts
- Analyze user statistics
- Update dependencies: `npm update`
- Backup database: `cp server/qvision.db server/backups/qvision_$(date +%Y%m%d).db`

---

## 📞 Support & Maintenance

### Log Files:
- Server logs: Console output from `npm run dev`
- Test results: Output from test scripts
- Audit reports: Output from `db-audit.js`

### Database Backup:
```bash
# Create backup
cp server/qvision.db server/qvision_backup_$(date +%Y%m%d).db

# Restore backup
cp server/qvision_backup_YYYYMMDD.db server/qvision.db
```

### Emergency Recovery:
If database is corrupted beyond repair:
```bash
# 1. Backup existing database
mv server/qvision.db server/qvision_corrupted.db

# 2. Start server to create fresh database
npm run dev

# 3. Create test user
node server/auto-setup-user.js

# 4. Verify
node server/test-auth.js
```

---

## ✅ Checklist for Production Deployment

- [ ] Change `SESSION_SECRET` to strong random value
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enable HTTPS and set `cookie.secure=true`
- [ ] Implement rate limiting on auth endpoints
- [ ] Add RBAC for admin endpoints
- [ ] Set up database backups (automated)
- [ ] Configure logging to files
- [ ] Add monitoring/alerting for failed logins
- [ ] Review and restrict CORS origins
- [ ] Add password complexity requirements
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Set up 2FA (optional)

---

## 🎯 Quick Reference

### Test User Credentials:
- **Username**: omar khalid
- **Email**: omarelkady880@gmail.com
- **Password**: 66276627

### Port Configuration:
- **Backend**: 3001
- **Frontend**: 5173 (Vite dev server)

### Database Location:
- **Path**: `server/qvision.db`
- **Type**: SQLite3

### Key Scripts:
```bash
# Start servers
npm run dev

# Database management
node server/db-audit.js
node server/db-cleanup.js
node server/auto-setup-user.js

# Testing
node server/test-auth.js
```

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintainer**: QChemAxis Development Team
