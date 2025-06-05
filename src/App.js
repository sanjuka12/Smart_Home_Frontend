import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IAMMeterDashboard from './components/IAMMeterDashboard';
import './App.css';
import Analytics from './pages/Analytics';
import Devices from './pages/Devices';
import LoginPage from './pages/LoginPage';
import Maintenance from './pages/Maintenance';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/LoginPage" replace />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/dashboard" element={<IAMMeterDashboard />} />
        <Route path="/analytics1" element={<Analytics />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/Maintenance" element={<Maintenance />} />
        <Route path="/users" element={<Users />} />
        <Route path="/Settings" element={<Settings />} />
        

      </Routes>
    </div>
  );
}

export default App;
