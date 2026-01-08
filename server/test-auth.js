/**
 * QChemAxis Authentication & User Management Test Suite
 * 
 * Comprehensive testing script for all authentication flows and user management endpoints.
 * 
 * Usage:
 *   node test-auth.js              # Run all tests
 *   node test-auth.js --basic      # Run basic auth tests only
 *   node test-auth.js --admin      # Run admin tests only
 */

require('dotenv').config();

const BASE_URL = 'http://localhost:3001';
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Store session cookie for authenticated requests
let sessionCookie = null;
let testUserId = null;

/**
 * Test helper to make HTTP requests
 */
async function makeRequest(method, path, body = null, includeAuth = false) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (includeAuth && sessionCookie) {
    options.headers['Cookie'] = sessionCookie;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    
    // Capture session cookie
    if (response.headers.get('set-cookie')) {
      sessionCookie = response.headers.get('set-cookie').split(';')[0];
    }

    const data = await response.json().catch(() => null);
    
    return {
      status: response.status,
      ok: response.ok,
      data: data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

/**
 * Log test result
 */
function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status} - ${name}`);
  if (message) console.log(`         ${message}`);
  
  testResults.tests.push({ name, passed, message });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

/**
 * Test Suite 1: Basic Health Check
 */
async function testHealthCheck() {
  console.log('\n📊 Test Suite 1: Server Health');
  console.log('================================');

  const response = await makeRequest('GET', '/health');
  logTest(
    'Server health endpoint',
    response.ok && response.data.status === 'OK',
    response.ok ? 'Server is running' : `Status: ${response.status}`
  );
}

/**
 * Test Suite 2: User Registration
 */
async function testRegistration() {
  console.log('\n📝 Test Suite 2: User Registration');
  console.log('===================================');

  // Test 1: Register with valid credentials
  const timestamp = Date.now();
  const testUser = {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@qchemaxis.com`,
    password: 'testpass123'
  };

  const response = await makeRequest('POST', '/api/auth/signup', testUser);
  logTest(
    'Register new user with valid credentials',
    response.status === 201 && response.data.user,
    response.data.user ? `User ID: ${response.data.user.id}` : response.data.error
  );

  if (response.data.user) {
    testUserId = response.data.user.id;
  }

  // Test 2: Duplicate email
  const dupResponse = await makeRequest('POST', '/api/auth/signup', testUser);
  logTest(
    'Reject duplicate email',
    dupResponse.status === 409,
    dupResponse.data.error || 'Should return 409 Conflict'
  );

  // Test 3: Invalid email format
  const invalidEmailResponse = await makeRequest('POST', '/api/auth/signup', {
    username: 'testuser2',
    email: 'invalidemail',
    password: 'testpass123'
  });
  logTest(
    'Reject invalid email format',
    invalidEmailResponse.status === 400,
    invalidEmailResponse.data.error || 'Should return 400 Bad Request'
  );

  // Test 4: Short password
  const shortPassResponse = await makeRequest('POST', '/api/auth/signup', {
    username: 'testuser3',
    email: 'test3@qchemaxis.com',
    password: '123'
  });
  logTest(
    'Reject short password (<6 chars)',
    shortPassResponse.status === 400,
    shortPassResponse.data.error || 'Should return 400 Bad Request'
  );

  // Test 5: Short username
  const shortUserResponse = await makeRequest('POST', '/api/auth/signup', {
    username: 'ab',
    email: 'test4@qchemaxis.com',
    password: 'testpass123'
  });
  logTest(
    'Reject short username (<3 chars)',
    shortUserResponse.status === 400,
    shortUserResponse.data.error || 'Should return 400 Bad Request'
  );

  // Test 6: Missing fields
  const missingFieldsResponse = await makeRequest('POST', '/api/auth/signup', {
    username: 'testuser5'
  });
  logTest(
    'Reject missing required fields',
    missingFieldsResponse.status === 400,
    missingFieldsResponse.data.error || 'Should return 400 Bad Request'
  );
}

/**
 * Test Suite 3: User Login
 */
async function testLogin() {
  console.log('\n🔐 Test Suite 3: User Login');
  console.log('============================');

  // Test 1: Login with valid credentials
  const loginResponse = await makeRequest('POST', '/api/auth/login', {
    email: 'omarelkady880@gmail.com',
    password: '66276627'
  });
  logTest(
    'Login with valid credentials',
    loginResponse.ok && loginResponse.data.user,
    loginResponse.data.user ? `Logged in as: ${loginResponse.data.user.username}` : loginResponse.data.error
  );

  // Test 2: Invalid password
  const wrongPassResponse = await makeRequest('POST', '/api/auth/login', {
    email: 'omarelkady880@gmail.com',
    password: 'wrongpassword'
  });
  logTest(
    'Reject invalid password',
    wrongPassResponse.status === 401,
    wrongPassResponse.data.error || 'Should return 401 Unauthorized'
  );

  // Test 3: Non-existent user
  const noUserResponse = await makeRequest('POST', '/api/auth/login', {
    email: 'nonexistent@example.com',
    password: 'anypassword'
  });
  logTest(
    'Reject non-existent user',
    noUserResponse.status === 401,
    noUserResponse.data.error || 'Should return 401 Unauthorized'
  );

  // Test 4: Missing fields
  const missingFieldsResponse = await makeRequest('POST', '/api/auth/login', {
    email: 'test@example.com'
  });
  logTest(
    'Reject missing password',
    missingFieldsResponse.status === 400,
    missingFieldsResponse.data.error || 'Should return 400 Bad Request'
  );
}

/**
 * Test Suite 4: Authentication Status
 */
async function testAuthStatus() {
  console.log('\n🔍 Test Suite 4: Authentication Status');
  console.log('=======================================');

  // Test 1: Check auth status (should be authenticated from previous login)
  const statusResponse = await makeRequest('GET', '/api/auth/status', null, true);
  logTest(
    'Check authenticated status',
    statusResponse.ok && statusResponse.data.authenticated === true,
    statusResponse.data.user ? `User: ${statusResponse.data.user.username}` : 'Not authenticated'
  );

  // Test 2: Check status without session cookie
  sessionCookie = null;
  const noAuthResponse = await makeRequest('GET', '/api/auth/status', null, false);
  logTest(
    'Check unauthenticated status',
    noAuthResponse.ok && noAuthResponse.data.authenticated === false,
    'Should return authenticated: false'
  );

  // Re-login for subsequent tests
  const reloginResponse = await makeRequest('POST', '/api/auth/login', {
    email: 'omarelkady880@gmail.com',
    password: '66276627'
  });
  if (reloginResponse.ok) {
    console.log('  ℹ️  Re-authenticated for remaining tests');
  }
}

/**
 * Test Suite 5: Admin Endpoints
 */
async function testAdminEndpoints() {
  console.log('\n👑 Test Suite 5: Admin Endpoints');
  console.log('==================================');

  // Test 1: Get all users
  const usersResponse = await makeRequest('GET', '/api/admin/users', null, true);
  logTest(
    'Get all users',
    usersResponse.ok && Array.isArray(usersResponse.data.users),
    usersResponse.data.users ? `Found ${usersResponse.data.users.length} users` : usersResponse.data.error
  );

  // Test 2: Get specific user
  if (testUserId) {
    const userResponse = await makeRequest('GET', `/api/admin/users/${testUserId}`, null, true);
    logTest(
      'Get specific user by ID',
      userResponse.ok && userResponse.data.user,
      userResponse.data.user ? `User: ${userResponse.data.user.username}` : userResponse.data.error
    );
  }

  // Test 3: Get user stats
  if (testUserId) {
    const statsResponse = await makeRequest('GET', `/api/admin/users/${testUserId}/stats`, null, true);
    logTest(
      'Get user statistics',
      statsResponse.ok && statsResponse.data.stats,
      statsResponse.data.stats ? `Quizzes: ${statsResponse.data.stats.quizzesTaken}` : statsResponse.data.error
    );
  }

  // Test 4: Get system stats
  const systemStatsResponse = await makeRequest('GET', '/api/admin/stats', null, true);
  logTest(
    'Get system statistics',
    systemStatsResponse.ok && systemStatsResponse.data.stats,
    systemStatsResponse.data.stats ? `Total users: ${systemStatsResponse.data.stats.totalUsers}` : systemStatsResponse.data.error
  );

  // Test 5: Get database health
  const healthResponse = await makeRequest('GET', '/api/admin/health', null, true);
  logTest(
    'Get database health',
    healthResponse.ok && healthResponse.data.health,
    healthResponse.data.health ? `Status: ${healthResponse.data.health.overall}` : healthResponse.data.error
  );

  // Test 6: Update user level
  if (testUserId) {
    const updateLevelResponse = await makeRequest('PUT', `/api/admin/users/${testUserId}/level`, 
      { level: 'Intermediate' }, true);
    logTest(
      'Update user level',
      updateLevelResponse.ok,
      updateLevelResponse.data.message || updateLevelResponse.data.error
    );
  }

  // Test 7: Invalid user ID
  const invalidIdResponse = await makeRequest('GET', '/api/admin/users/99999', null, true);
  logTest(
    'Handle invalid user ID',
    invalidIdResponse.status === 404,
    'Should return 404 Not Found'
  );

  // Test 8: Unauthorized access (no session)
  sessionCookie = null;
  const noAuthResponse = await makeRequest('GET', '/api/admin/users', null, false);
  logTest(
    'Block unauthorized admin access',
    noAuthResponse.status === 401,
    'Should return 401 Unauthorized'
  );

  // Re-login
  await makeRequest('POST', '/api/auth/login', {
    email: 'omarelkady880@gmail.com',
    password: '66276627'
  });
}

/**
 * Test Suite 6: Logout
 */
async function testLogout() {
  console.log('\n🚪 Test Suite 6: Logout');
  console.log('========================');

  // Test 1: Logout
  const logoutResponse = await makeRequest('POST', '/api/auth/logout', null, true);
  logTest(
    'Logout successfully',
    logoutResponse.ok,
    logoutResponse.data.message || 'Logout completed'
  );

  // Test 2: Verify session cleared
  const statusResponse = await makeRequest('GET', '/api/auth/status', null, true);
  logTest(
    'Verify session cleared after logout',
    statusResponse.ok && statusResponse.data.authenticated === false,
    'Should not be authenticated'
  );
}

/**
 * Test Suite 7: Edge Cases
 */
async function testEdgeCases() {
  console.log('\n⚡ Test Suite 7: Edge Cases');
  console.log('============================');

  // Test 1: SQL Injection attempt
  const sqlResponse = await makeRequest('POST', '/api/auth/login', {
    email: "admin' OR '1'='1",
    password: "password"
  });
  logTest(
    'Prevent SQL injection',
    sqlResponse.status === 401,
    'Should reject SQL injection attempt'
  );

  // Test 2: XSS in username
  const xssResponse = await makeRequest('POST', '/api/auth/signup', {
    username: '<script>alert("xss")</script>',
    email: 'xss@test.com',
    password: 'testpass123'
  });
  logTest(
    'Handle XSS in input',
    xssResponse.status === 201 || xssResponse.status === 409,
    'Should sanitize or accept XSS input'
  );

  // Test 3: Very long username
  const longUsername = 'a'.repeat(1000);
  const longUsernameResponse = await makeRequest('POST', '/api/auth/signup', {
    username: longUsername,
    email: 'longuser@test.com',
    password: 'testpass123'
  });
  logTest(
    'Handle very long username',
    longUsernameResponse.status === 201 || longUsernameResponse.status === 400 || longUsernameResponse.status === 409,
    'Should handle or reject long input'
  );

  // Test 4: Unicode characters in username
  const unicodeResponse = await makeRequest('POST', '/api/auth/signup', {
    username: '测试用户👨‍🔬',
    email: 'unicode@test.com',
    password: 'testpass123'
  });
  logTest(
    'Handle unicode characters',
    unicodeResponse.status === 201 || unicodeResponse.status === 400 || unicodeResponse.status === 409,
    'Should handle unicode input'
  );

  // Test 5: Null values
  const nullResponse = await makeRequest('POST', '/api/auth/signup', {
    username: null,
    email: null,
    password: null
  });
  logTest(
    'Handle null values',
    nullResponse.status === 400,
    'Should reject null values'
  );
}

/**
 * Generate final report
 */
function generateReport() {
  console.log('\n\n📋 ===== TEST SUMMARY =====');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => {
        console.log(`  - ${t.name}`);
        if (t.message) console.log(`    ${t.message}`);
      });
  }

  console.log('\n===========================\n');
  
  return testResults.failed === 0;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n🧪 QChemAxis Authentication & User Management Test Suite');
  console.log('=========================================================');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  const args = process.argv.slice(2);
  const runBasic = args.length === 0 || args.includes('--basic');
  const runAdmin = args.length === 0 || args.includes('--admin');

  try {
    await testHealthCheck();
    
    if (runBasic) {
      await testRegistration();
      await testLogin();
      await testAuthStatus();
      await testLogout();
      await testEdgeCases();
    }
    
    if (runAdmin) {
      // Re-login for admin tests
      await makeRequest('POST', '/api/auth/login', {
        email: 'omarelkady880@gmail.com',
        password: '66276627'
      });
      await testAdminEndpoints();
    }

    const allPassed = generateReport();
    
    console.log('💡 Next Steps:');
    console.log('  1. Review any failed tests');
    console.log('  2. Run: node server/db-audit.js (to audit database)');
    console.log('  3. Run: node server/db-cleanup.js (if issues found)');
    console.log('  4. Test frontend authentication flows manually\n');

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n💥 Test suite crashed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
