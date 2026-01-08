import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from './context/UserContext';
import Login from "./components/Login";
import Signup from "./components/Signup";
import AutoLogin from "./components/AutoLogin";
import QChemAxis from "./QChemAxis";

// Rollbar imports
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '21391343f7f644c6a327090190f5db8c', // ضع هنا الـ access token الصحيح
  environment: 'testenv', // أو production حسب ما تحب
};

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useUser();
  
  // Debug logging
  console.log('ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-cyan-400 text-xl">Checking authentication...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace={true}/>; 
  return children;
}

export default function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AutoLogin>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <QChemAxis />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AutoLogin>
      </ErrorBoundary>
    </Provider>
  );
}
