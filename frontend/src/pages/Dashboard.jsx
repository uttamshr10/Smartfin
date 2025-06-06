import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet /> {/* This will load the nested routes like Accounts */}
      </div>
    </div>
  );
};

export default Dashboard;
