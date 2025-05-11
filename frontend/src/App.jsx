import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StockDashboard from './components/StockDashboard.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h1>SmartFin</h1>
        <ul>
          <li>
            <Link to="/">Stock Dashboard</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<StockDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;