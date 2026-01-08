import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AutoLogin = ({ children }) => {
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const { user, login, loading } = useUser();
  const navigate = useNavigate();

  const AUTO_LOGIN_CREDENTIALS = {
    email: 'omarelkady880@gmail.com',
    password: '66276627'
  };

  useEffect(() => {
    // Debug logging
    console.log('AutoLogin: useEffect triggered - user:', !!user, 'loading:', loading, 'autoLoginAttempted:', autoLoginAttempted);
    
    // Only attempt auto-login if:
    // 1. User is not already logged in
    // 2. App has finished loading
    // 3. We haven't already attempted auto-login
    if (!user && !loading && !autoLoginAttempted) {
      console.log('AutoLogin: Proceeding with auto-login attempt');
      attemptAutoLogin();
    } else {
      console.log('AutoLogin: Skipping auto-login - conditions not met');
    }
  }, [user, loading, autoLoginAttempted]);

  const attemptAutoLogin = async () => {
    setIsAutoLoggingIn(true);
    setAutoLoginAttempted(true);

    try {
      console.log('🤖 Auto-login: Attempting automatic login...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AUTO_LOGIN_CREDENTIALS)
      });

      // Check if server is reachable
      if (response.status === 0) {
        console.error('❌ Auto-login: Cannot connect to server. Is the backend running on port 3001?');
        setIsAutoLoggingIn(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.user) {
        console.log('✅ Auto-login: Success!', data.user.username);
        login(data.user, data.token);
        navigate('/app');
      } else {
        console.log('⚠️ Auto-login: Failed -', data.error);
        // Even if auto-login fails, continue to the app (user can login manually)
        setIsAutoLoggingIn(false);
      }
    } catch (error) {
      console.error('❌ Auto-login: Error -', error);
      console.log('💡 Tip: Make sure the backend server is running on port 3001');
      // Continue without auto-login (user can login manually)
      setIsAutoLoggingIn(false);
    }
  };

  // Show auto-login loading state
  if (isAutoLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">Automatic login in progress...</div>
          <div className="text-cyan-300 text-sm mt-2">Authenticating as omar khalid</div>
        </div>
      </div>
    );
  }

  return children;
};

export default AutoLogin;
