import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Dashboard from './pages/Dashboard'; // layout
import Accounts from './pages/Accounts';
import Auth from './pages/Auth';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Predictions from './pages/Predictions';
import Transactions from './pages/Transactions';
import StockDashboard from './components/StockDashboard'; // from components

const App = () => {
  return (
    <Routes>
      {/* ✅ PUBLIC SITE ROUTES */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/about"
        element={
          <>
            <Navbar />
            <AboutUs />
            <Footer />
          </>
        }
      />
      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        }
      />
      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        }
      />
      <Route
        path="/signup"
        element={
          <>
            <Navbar />
            <Signup />
            <Footer />
          </>
        }
      />

      {/* ✅ DASHBOARD ROUTES - NO Navbar/Footer */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="accounts" element={<Accounts />} />
        <Route path="auth" element={<Auth />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="stocks" element={<StockDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
