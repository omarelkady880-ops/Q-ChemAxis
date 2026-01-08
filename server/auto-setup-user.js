// Auto-setup script for test user
require('dotenv').config();
const { findUserByEmail, createUser } = require('./database');

const TEST_USER = {
  username: 'omar khalid',
  email: 'omarelkady880@gmail.com',
  password: '66276627'
};

async function setupTestUser() {
  try {
    console.log('🔍 Checking if test user exists...');
    const existingUser = await findUserByEmail(TEST_USER.email);
    
    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.username);
      return existingUser;
    }
    
    console.log('📝 Creating test user...');
    const newUser = await createUser(
      TEST_USER.username,
      TEST_USER.email,
      TEST_USER.password
    );
    
    console.log('✅ Test user created successfully!');
    console.log('   Username:', newUser.username);
    console.log('   Email:', newUser.email);
    console.log('   ID:', newUser.id);
    
    return newUser;
  } catch (error) {
    console.error('❌ Error setting up test user:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  setupTestUser()
    .then(() => {
      console.log('\n🎉 Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupTestUser, TEST_USER };
