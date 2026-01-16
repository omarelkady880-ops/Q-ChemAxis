import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Atom, Beaker, FlaskConical, Mail, Lock, Chrome } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔐 Attempting login for:', form.email);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      console.log('📡 Login response:', { status: res.status, authenticated: !!data.user });
      
      if (res.ok && data.user) {
        console.log('✅ Login successful, setting user context');
        login(data.user);
        navigate('/app');
      } else {
        console.log('❌ Login failed:', data.error);
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Connection failed. Please ensure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
        
      // In a real implementation, you would redirect to Google OAuth
      // For this demo, we'll use the actual backend endpoint
      // This simulates the flow where user is redirected to Google, then back to our app
        
      // Using a mock Google response for demo purposes
      // In a real app, you'd receive this from Google after OAuth flow
      const mockGoogleResponse = {
        email: 'demo_user@gmail.com',
        name: 'Demo User',
        googleId: 'demo_google_id_12345'
      };
        
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleResponse),
      });
        
      const data = await res.json();
        
      if (res.ok && data.user) {
        console.log('✅ Google login successful, setting user context');
        login(data.user, data.token);
        navigate('/app');
      } else {
        console.log('❌ Google login failed:', data.error);
        setError(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      setError('Connection failed. Please ensure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                <Atom className="w-10 h-10 text-cyan-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                <Beaker className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome to QChem Axis
          </h2>
          <p className="text-cyan-300 text-lg">
            Sign in to continue your chemistry journey
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-cyan-400/30 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-white font-semibold rounded-lg shadow-lg border border-red-400/50 transition-all flex items-center justify-center space-x-3"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-cyan-300">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
