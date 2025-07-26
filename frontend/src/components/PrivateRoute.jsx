import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists in localStorage
  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/login" />;
  }
  return children; // If token exists, allow access to the protected route
};

export default PrivateRoute;
