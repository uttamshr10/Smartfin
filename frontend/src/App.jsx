// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Predictions from "./pages/Predictions";
import Transactions from "./pages/Transactions";
import StockDashboard from "./components/StockDashboard";
import HistoricalPrice from "./pages/HistoricalPrice";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* PUBLIC SITE ROUTES */}
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

      {/* DASHBOARD ROUTES - Protected */}
      <Route
        path="/dashboard"
        element={
          <Dashboard />
          }
      >
        <Route path="budgets" element={<Budgets />} />
        <Route path="goals" element={<Goals />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="stocks" element={<StockDashboard />} />
        
      </Route>
      <Route
  path="/dashboard/historical-price/:symbol"
  element={
    <ProtectedRoute>
      <>
        <HistoricalPrice />
      </>
    </ProtectedRoute>
  }
/>
    </Routes>
  );
};

export default App;