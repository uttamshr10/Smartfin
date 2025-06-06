// src/components/Layout.js
import React from "react";
import Sidebar from "./SideBar";
import './Layout.css'; // Make sure this file exists

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
