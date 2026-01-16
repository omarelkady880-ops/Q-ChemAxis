import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserContext: Starting auth status check, initial loading:', loading);
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('UserContext: Checking auth status, token exists:', !!localStorage.getItem('authToken'));
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('UserContext: No token found, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('UserContext: Token found, checking status with API');
      const response = await fetch('/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('UserContext: API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('UserContext: API response data:', data);
        if (data.authenticated && data.user) {
          setUser(data.user);
          console.log('✅ User authenticated:', data.user.username);
        } else {
          // Token invalid, remove it
          localStorage.removeItem('authToken');
          console.log('❌ Token invalid, removed');
        }
      } else {
        // Token invalid, remove it
        localStorage.removeItem('authToken');
        console.log('❌ Token invalid (HTTP error), removed');
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      console.log('UserContext: Setting loading to false');
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('http://localhost:3001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
