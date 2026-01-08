# QChemAxis Login/Sign-Up Recreation TODO

## Phase 1: Remove Existing Auth Code
- [ ] Delete server/auth.js
- [ ] Delete server/auth-fixed.js
- [ ] Delete src/components/Login.jsx
- [ ] Delete src/components/Signup.jsx
- [ ] Delete src/components/Auth.jsx (if exists)
- [ ] Remove auth-related test files and debug guides

## Phase 2: Install Dependencies
- [x] Install jsonwebtoken and bcryptjs packages (already installed)

## Phase 3: Backend Implementation
- [x] Create new server/auth-jwt.js with JWT-based authentication
- [x] Update server/server.js to use JWT auth instead of sessions
- [x] Update server/database.js for any JWT-related changes (if needed)

## Phase 4: Frontend Implementation
- [x] Update src/components/Login.jsx to handle JWT tokens
- [x] Update src/components/Signup.jsx to handle JWT tokens
- [x] Update src/context/UserContext.jsx to handle JWT tokens and auto-login

## Phase 5: Testing and Verification
- [ ] Test signup functionality (user creation in database)
- [ ] Test login functionality (JWT issuance and validation)
- [ ] Test logout functionality (token clearing)
- [ ] Test CORS and API integration
- [ ] Update environment variables for JWT secret

## Phase 6: Deployment Preparation
- [ ] Ensure compatibility with Vercel deployment
- [ ] Update package.json if needed
- [ ] Final verification of all features
