# Q-ChemAxis Setup Guide

This guide will help you set up and run the Q-ChemAxis project on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### Checking Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/qchem-axis.git
cd qchem-axis
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies for both frontend and backend.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="./server/qvision.db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-here"

# AI API Configuration
MISTRAL_API_KEY="your-mistral-api-key-here"
VITE_API_URL="http://localhost:3001/api/mistral"

# Development/Production
NODE_ENV="development"
VITE_MODEL="mistral-medium"
```

### 4. Start Development Environment

#### Option A: Start Both Frontend and Backend (Recommended)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173`

#### Option B: Start Separately

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:frontend
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Authentication tests
node test-auth-endpoints.js

# Frontend integration tests
node test-frontend-integration.js
```

## 🏗️ Building for Production

### 1. Build the Frontend

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

The application will be available on `http://localhost:3001`

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

If you get port conflicts:

```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 5173
npx kill-port 5173
```

#### Database Issues

Reset the database:

```bash
# Remove existing database
rm server/qvision.db

# Restart the server (it will recreate the database)
npm run dev:server
```

#### Dependency Issues

Clear npm cache and reinstall:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables

Ensure your `.env` file has the correct values:

- `MISTRAL_API_KEY`: Get from [Mistral AI Console](https://console.mistral.ai/)
- `JWT_SECRET`: Generate a secure random string (32+ characters)

## 📁 Project Structure

```
qchem-axis/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── lib/               # Utility libraries
│   └── chemistry_knowledge_base.json
├── server/                # Backend Node.js server
│   ├── database.js        # Database operations
│   ├── server.js          # Main server file
│   └── auth.js            # Authentication logic
├── public/                # Static assets
├── tests/                 # Test files
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes:**
   - Edit files in `src/`
   - Changes auto-reload in development mode

2. **Backend Changes:**
   - Edit files in `server/`
   - Restart server for changes to take effect

3. **Database Changes:**
   - Modify `server/database.js`
   - Reset database if schema changes

### Adding New Features

1. **Frontend Features:**
   - Add components in `src/components/`
   - Update routes in `src/App.jsx`

2. **Backend Features:**
   - Add endpoints in `server/server.js`
   - Update database schema if needed

## 🚀 Deployment

### Production Build Verification

Before deploying, ensure `npm start` works correctly:

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

The application should be available on `http://localhost:3001`

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

### Railway/Render (Full-Stack)

1. **Connect Repository:**
   - Create account on Railway.app or Render.com
   - Connect your GitHub repository

2. **Environment Variables:**
   Set these in your deployment platform:
   ```
   DATABASE_URL="./server/qvision.db"
   JWT_SECRET="your-production-jwt-secret"
   MISTRAL_API_KEY="your-mistral-api-key"
   NODE_ENV="production"
   PORT=3001
   ```

3. **Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Deploy**

### Heroku (Alternative)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set MISTRAL_API_KEY="your-key"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Manual Server Deployment

```bash
# On your server
git clone https://github.com/yourusername/qchem-axis.git
cd qchem-axis

# Install dependencies
npm install

# Create .env file with production values
cp .env.example .env
# Edit .env with production values

# Build and start
npm run build
npm start
```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t qchem-axis .
docker run -p 3001:3001 qchem-axis
```

## 📞 Support

If you encounter issues:

1. Check the [README.md](README.md) for general information
2. Review the troubleshooting section above
3. Check existing GitHub issues
4. Create a new issue with detailed information

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for database access
- Keep API keys secure and rotate regularly
- Use HTTPS in production environments

---

**Happy coding with Q-ChemAxis! 🧪✨**
