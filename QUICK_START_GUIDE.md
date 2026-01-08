# 🚀 QChemAxis User Management - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start the Application
```bash
npm run dev
```
✅ Backend should start on port **3001**  
✅ Frontend should start on port **5173**

---

### Step 2: Verify Database Health
```bash
node server/db-audit.js
```
**Expected Output**:
```
✅ Database Status: HEALTHY
✅ Total Users: 1
✅ No Issues Found
```

---

### Step 3: Run Authentication Tests
```bash
node server/test-auth.js
```
**Expected Output**:
```
✅ Total Tests: 20
✅ Passed: 20
✅ Success Rate: 100%
```

---

## 🔑 Test User Credentials

**Pre-configured test account**:
- **Email**: omarelkady880@gmail.com
- **Password**: 66276627
- **Username**: omar khalid

**Auto-login**: The app automatically logs in with these credentials on startup.

---

## 🛠️ Essential Commands

### Database Management
```bash
# Audit database (check for issues)
node server/db-audit.js

# Clean database (dry run first!)
node server/db-cleanup.js --dry-run
node server/db-cleanup.js --live

# Create test user
node server/auto-setup-user.js
```

### Testing
```bash
# Run all tests
node server/test-auth.js

# Run specific test suites
node server/test-auth.js --basic    # Authentication only
node server/test-auth.js --admin    # Admin endpoints only
```

---

## 📊 Admin API Quick Reference

### Get All Users
```bash
GET http://localhost:3001/api/admin/users
```

### Get User Stats
```bash
GET http://localhost:3001/api/admin/users/2/stats
```

### Update User Level
```bash
PUT http://localhost:3001/api/admin/users/2/level
Body: { "level": "Advanced" }
```

### System Health
```bash
GET http://localhost:3001/api/admin/health
```

---

## 🔍 Troubleshooting

### Problem: Server won't start
**Solution**:
```bash
# Check if port 3001 is already in use
# Kill the process and restart
npm run dev
```

### Problem: Database locked
**Solution**:
```bash
# Stop all node processes
# Restart the server
npm run dev
```

### Problem: Tests failing
**Solution**:
```bash
# Ensure server is running first
npm run dev
# Then run tests in a new terminal
node server/test-auth.js
```

---

## 📖 Need More Help?

- **Full Guide**: See [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md)
- **Implementation Details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **API Documentation**: Check USER_MANAGEMENT_GUIDE.md § Admin API Endpoints

---

## ✅ Quick Health Check Checklist

- [ ] Server running on port 3001
- [ ] Frontend running on port 5173
- [ ] Database audit shows "HEALTHY"
- [ ] All tests passing (100%)
- [ ] Can login with test credentials
- [ ] User dashboard displays stats

**If all checked, you're good to go!** ✨

---

**Last Updated**: January 8, 2026
