// src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    localStorage.removeItem("userId"); // Clear userId
    navigate("/login", { replace: true }); // Redirect to login, preventing back
  };

  return (
    <div className="sidebar">
      <h2>SmartFin</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/budgets">Budgets</Link></li>
        <li><Link to="/dashboard/goals">Goals</Link></li>
        <li><Link to="/dashboard/predictions">Predictions</Link></li>
        <li><Link to="/dashboard/stocks">Stocks</Link></li>
        <li><Link to="/dashboard/transactions">Transactions</Link></li>
        <li>
          <Link to="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;