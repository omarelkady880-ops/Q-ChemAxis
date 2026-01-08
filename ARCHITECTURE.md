# Q-ChemAxis Architecture Documentation

## 🏗️ System Overview

Q-ChemAxis is a full-stack chemistry education platform that combines artificial intelligence, interactive learning tools, and comprehensive educational resources. The system is designed to provide an immersive, AI-powered chemistry learning experience.

## 🖥️ Technology Stack

### Frontend
- **Framework:** React 18 with Hooks
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Error Monitoring:** Rollbar
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** JWT (JSON Web Tokens)
- **AI Integration:** Mistral AI API
- **CORS:** Enabled for cross-origin requests
- **Session Management:** express-session

### Development Tools
- **Package Manager:** npm
- **Version Control:** Git
- **Code Quality:** ESLint (implied)
- **Testing:** Custom test scripts

## 📁 Project Structure

```
qchem-axis/
├── src/                          # Frontend Source Code
│   ├── components/               # React Components
│   │   ├── Login.jsx            # User authentication
│   │   ├── Signup.jsx           # User registration
│   │   ├── AutoLogin.jsx        # Automatic login handling
│   │   ├── ProtectedRoute.jsx   # Route protection
│   │   ├── Dashboard.jsx        # User dashboard
│   │   └── UserDashboard.jsx    # User-specific dashboard
│   ├── context/                 # React Context Providers
│   │   └── UserContext.jsx      # User state management
│   ├── lib/                     # Utility Libraries
│   │   └── mistralClient.js     # AI API client
│   ├── chemistry_knowledge_base.json  # Chemistry data
│   ├── App.jsx                  # Main application component
│   ├── QChemAxis.jsx            # Core chemistry interface
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── server/                      # Backend Source Code
│   ├── database.js              # Database operations
│   ├── server.js                # Main server file
│   ├── auth.js                  # Authentication logic
│   ├── auth-jwt.js              # JWT authentication
│   ├── mistral-proxy.js         # AI API proxy
│   ├── quiz.js                  # Quiz functionality
│   ├── preferences.js           # User preferences
│   ├── admin.js                 # Admin utilities
│   ├── db-audit.js              # Database auditing
│   ├── db-cleanup.js            # Database maintenance
│   ├── auto-setup-user.js       # User auto-setup
│   ├── qvision.db               # SQLite database file
│   └── server-stable.js         # Stable server version
├── public/                      # Static Assets
├── tests/                       # Test Files (planned)
├── package.json                 # Dependencies & Scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.cjs          # Tailwind CSS config
├── postcss.config.cjs           # PostCSS configuration
└── README.md                    # Project documentation
```

## 🔄 Application Flow

### 1. User Authentication Flow

```
User Access → Login/Signup → JWT Token Generation → Protected Routes → Dashboard
     ↓              ↓              ↓                        ↓              ↓
   Public      Authentication    Token Storage         Route Guard     Main App
   Routes         Server            (localStorage)       Check          Interface
```

### 2. AI Chat Interaction Flow

```
User Question → Frontend → API Request → Backend → Mistral AI → Response → Frontend Display
     ↓              ↓          ↓            ↓          ↓          ↓            ↓
   Input Field    React State  HTTP POST   Express    API Call   JSON        Chat UI
   Component      Update       Request     Server     Proxy      Response   Update
```

### 3. Data Flow Architecture

```
Frontend (React) ↔ API Layer (Express) ↔ Database (SQLite)
     ↓                    ↓                      ↓
   Components        Routes/Controllers       Tables/Queries
   State Mgmt        Middleware            Data Persistence
   User Interface    Business Logic         User/Auth Data
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    level TEXT DEFAULT 'Beginner',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    preferences TEXT
);
```

### Sessions Table (if using sessions)
```sql
CREATE TABLE sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire INTEGER NOT NULL
);
```

## 🔗 API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### AI Integration Endpoints
- `POST /api/mistral` - AI chat completion
- `GET /api/models` - Available AI models

### User Management Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/preferences` - Update user preferences
- `POST /api/user/reset-password` - Password reset

### Quiz and Learning Endpoints
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results` - Get quiz results

## 🔐 Security Architecture

### Authentication & Authorization
- **JWT Tokens:** Stateless authentication with expiration
- **Password Hashing:** bcrypt for secure password storage
- **Session Management:** Secure session handling with express-session
- **CORS:** Configured for cross-origin requests
- **Input Validation:** Server-side validation for all inputs

### Data Protection
- **Environment Variables:** Sensitive data stored in .env files
- **SQL Injection Prevention:** Parameterized queries
- **XSS Protection:** Input sanitization
- **CSRF Protection:** Token-based prevention

## 🎨 Frontend Architecture

### Component Hierarchy
```
App (Root)
├── AutoLogin (Authentication Wrapper)
├── Routes
│   ├── Public Routes
│   │   ├── Login
│   │   └── Signup
│   └── Protected Routes
│       └── QChemAxis (Main Interface)
            ├── Sidebar Navigation
            ├── Chat Interface
            ├── Periodic Table
            ├── Chemistry Branches
            ├── Simulations
            ├── Courses
            └── References
```

### State Management
- **UserContext:** Global user state and authentication
- **Local State:** Component-level state for UI interactions
- **Session Storage:** Persistent chat history and preferences

## ⚙️ Backend Architecture

### Server Structure
```javascript
server/
├── server.js          // Main Express app setup
├── database.js        // Database connection and queries
├── auth.js           // Authentication middleware
├── auth-jwt.js       // JWT token handling
└── [feature].js      // Feature-specific modules
```

### Middleware Stack
1. **CORS** - Cross-origin resource sharing
2. **Body Parser** - JSON request parsing
3. **Session** - Session management
4. **Authentication** - JWT verification
5. **Error Handling** - Centralized error management
6. **Logging** - Request/response logging

## 🚀 Deployment Architecture

### Development Environment
- **Frontend:** Vite dev server (port 5173)
- **Backend:** Node.js server (port 3001)
- **Database:** Local SQLite file
- **Hot Reload:** Automatic frontend reloading

### Production Environment
- **Frontend:** Static files served by backend
- **Backend:** Node.js production server
- **Database:** SQLite (can be upgraded to PostgreSQL)
- **Process Manager:** PM2 or similar
- **Reverse Proxy:** Nginx (recommended)

### Environment Variables
```env
# Database
DATABASE_URL="./server/qvision.db"

# Security
JWT_SECRET="secure-random-string"
SESSION_SECRET="another-secure-string"

# AI Integration
MISTRAL_API_KEY="api-key-here"
VITE_API_URL="https://api.mistral.ai/v1/chat/completions"

# Application
NODE_ENV="production"
PORT=3001
VITE_MODEL="mistral-medium"
```

## 📊 Performance Considerations

### Frontend Optimization
- **Code Splitting:** Lazy loading of components
- **Asset Optimization:** Vite build optimization
- **Caching:** Browser caching strategies
- **Bundle Analysis:** Webpack bundle analyzer

### Backend Optimization
- **Database Indexing:** Optimized queries
- **Caching:** Response caching for static data
- **Rate Limiting:** API rate limiting
- **Compression:** Response compression

### AI Integration Optimization
- **Request Batching:** Batch similar requests
- **Caching:** Cache frequent responses
- **Streaming:** Real-time response streaming
- **Fallbacks:** Graceful degradation

## 🔧 Maintenance & Monitoring

### Logging
- **Application Logs:** Server-side logging
- **Error Tracking:** Rollbar integration
- **Performance Monitoring:** Response times and error rates
- **User Analytics:** Usage patterns and feature adoption

### Backup & Recovery
- **Database Backups:** Automated SQLite backups
- **Code Repository:** Git version control
- **Configuration:** Environment-specific configs
- **Disaster Recovery:** Backup restoration procedures

## 🚀 Scaling Considerations

### Horizontal Scaling
- **Stateless Design:** Easy to scale backend instances
- **Database:** Upgrade to PostgreSQL for high concurrency
- **Caching Layer:** Redis for session and data caching
- **Load Balancing:** Nginx or cloud load balancers

### Feature Extensions
- **Microservices:** Split into separate services
- **API Gateway:** Centralized API management
- **Message Queue:** Asynchronous processing
- **CDN:** Static asset delivery

## 📚 Educational Content Architecture

### Knowledge Base Structure
```json
{
  "periodicElements": [...],
  "branches": [...],
  "simulations": [...],
  "courses": [...],
  "references": [...]
}
```

### Content Management
- **Static Data:** JSON files for core content
- **Dynamic Updates:** API endpoints for content updates
- **Versioning:** Content versioning for updates
- **Localization:** Multi-language support preparation

---

## 🔄 Development Workflow

### Local Development
1. **Setup:** Clone repository and install dependencies
2. **Development:** Run `npm run dev` for full-stack development
3. **Testing:** Run test suites and integration checks
4. **Commit:** Follow conventional commit messages

### Deployment Pipeline
1. **Build:** Automated build process
2. **Test:** Automated testing in CI/CD
3. **Deploy:** Automated deployment to staging/production
4. **Monitor:** Continuous monitoring and alerting

This architecture provides a solid foundation for a scalable, maintainable chemistry education platform with room for future enhancements and feature additions.
