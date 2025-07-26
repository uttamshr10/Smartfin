import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Dashboard from './pages/Dashboard'; // layout
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Predictions from './pages/Predictions';
import Transactions from './pages/Transactions';
import StockDashboard from './components/StockDashboard'; // from components

import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  return (
    <Routes>
      {/* ✅ PUBLIC SITE ROUTES */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><AboutUs /><Footer /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
      <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
      <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />

      {/* ✅ PROTECTED DASHBOARD ROUTES */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
        {/* Removed Accounts and Auth routes */}
        {/* <Route path="accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
        <Route path="auth" element={<PrivateRoute><Auth /></PrivateRoute>} /> */}
        <Route path="budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
        <Route path="goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
        <Route path="predictions" element={<PrivateRoute><Predictions /></PrivateRoute>} />
        <Route path="transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="stocks" element={<PrivateRoute><StockDashboard /></PrivateRoute>} />
      </Route>
    </Routes>
  );
};

export default App;
