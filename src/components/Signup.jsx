import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Atom, Beaker, FlaskConical, Mail, Lock, Chrome } from 'lucide-react';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
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
      console.log('📝 Attempting signup for:', form.email);
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        }),
      });
      
      const data = await res.json();
      console.log('📡 Signup response:', { status: res.status, user: !!data.user });
      
      if (res.ok && data.user && data.token) {
        console.log('✅ Signup successful, setting user context with token');
        login(data.user, data.token);
        navigate('/app');
      } else {
        console.log('❌ Signup failed:', data.error);
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError('Connection failed. Please ensure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      
      // In a real implementation, you would redirect to Google OAuth
      // For this demo, we'll use the actual backend endpoint
      // This simulates the flow where user is redirected to Google, then back to our app
      
      // Using a mock Google response for demo purposes
      // In a real app, you'd receive this from Google after OAuth flow
      const mockGoogleResponse = {
        email: 'demo_newuser@gmail.com',
        name: 'Demo New User',
        googleId: 'demo_google_id_67890'
      };
      
      const res = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleResponse),
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        console.log('✅ Google signup successful, setting user context');
        login(data.user, data.token);
        navigate('/app');
      } else {
        console.log('❌ Google signup failed:', data.error);
        setError(data.error || 'Google signup failed');
      }
    } catch (error) {
      console.error('❌ Google signup error:', error);
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
            Create your account to start exploring chemistry
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-cyan-400/30 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-cyan-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              
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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleSignup}
              className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-white font-semibold rounded-lg shadow-lg border border-red-400/50 transition-all flex items-center justify-center space-x-3"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-cyan-300">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
