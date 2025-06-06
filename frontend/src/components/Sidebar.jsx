import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>SmartFin</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/accounts">Accounts</Link></li>
        <li><Link to="/dashboard/auth">Auth</Link></li>
        <li><Link to="/dashboard/budgets">Budgets</Link></li>
        <li><Link to="/dashboard/goals">Goals</Link></li>
        <li><Link to="/dashboard/predictions">Predictions</Link></li>
        <li><Link to="/dashboard/stocks">Stocks</Link></li>

        <li><Link to="/dashboard/transactions">Transactions</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
