import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

// Security Guard: Checks if the user's browser has a saved JWT token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If there is no token, immediately bounce them back to the login screen
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If they have a token, render the requested page
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route now safely redirects directly to the Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public Application Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Application Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;