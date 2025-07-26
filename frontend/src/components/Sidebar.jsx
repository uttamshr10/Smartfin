import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data, such as token
    localStorage.removeItem('token'); // or clear any other auth data
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="sidebar">
      <h2>SmartFin</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {/* Removed Accounts and Auth */}
        {/* <li><Link to="/dashboard/accounts">Accounts</Link></li>
        <li><Link to="/dashboard/auth">Auth</Link></li> */}
        <li><Link to="/dashboard/budgets">Budgets</Link></li>
        <li><Link to="/dashboard/goals">Goals</Link></li>
        <li><Link to="/dashboard/predictions">Predictions</Link></li>
        <li><Link to="/dashboard/stocks">Stocks</Link></li>
        <li><Link to="/dashboard/transactions">Transactions</Link></li>
        
        {/* Logout option */}
        <li onClick={handleLogout} style={{ cursor: 'pointer', color: 'red', marginTop: '10px' }}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
