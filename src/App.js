import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IAMMeterDashboard from './components/User/IAMMeterDashboard';
import './App.css';
import Analytics from './pages/Admin/Analytics';
import Analytics_User from './pages/User/Analytics_User';

import Devices from './pages/Admin/Devices';
import Devices_User from './pages/User/Devices_User';

import LoginPage from './pages/LoginPage';

import Maintenance from './pages/Admin/Maintenance';
import Maintenance_User from './pages/User/Maintenance_User';

import Users from './pages/Admin/Users';

import Settings from './pages/Admin/Settings';
import Settings_User from './pages/User/Settings_User';

import WeatherForecast from './components/User/weatherforecast';
import AdminWeatherforecast from './components/Admin/AdminWeatherforecast';

import Profile from './pages/Admin/Profile';
import Profile_User from './pages/User/Profile_User';

import DeviceMap from './pages/Admin/DeviceMap';
import DeviceMap_User from './pages/User/DeviceMap_User';

import Available_Inverter from './pages/Admin/Available_Inverter';
import Available_Inverter_User from './pages/User/Available_Inverter_User';

import AddInverter from './pages/Admin/AddInverter';

import Chart from './pages/Admin/Chart';
import Chart_User from './pages/User/Chart_User';

import Support from './pages/Admin/Support';
import Support_User from './pages/User/Support_User';

import DataLog from './pages/Admin/DataLog';

import AdminDashboard from './components/Admin/AdminDashboard';

import DeviceSearch from './pages/Admin/DeviceSearch';

import { SpeedInsights } from "@vercel/speed-insights/react"


import LoadFlow_User from './pages/User/LoadFlow_User';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/LoginPage" replace />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/dashboard" element={<IAMMeterDashboard />} />

        <Route path="/analytics1" element={<Analytics />} />
        <Route path="/analytics1_User" element={<Analytics_User />} />

        <Route path="/devices" element={<Devices />} />
        <Route path="/devices_User" element={<Devices_User />} />

        <Route path="/Maintenance" element={<Maintenance />} />
         <Route path="/Maintenance_User" element={<Maintenance_User />} />

        <Route path="/users" element={<Users />} />

        <Route path="/Settings" element={<Settings />} />
        <Route path="/Settings_User" element={<Settings_User/>} />

       <Route path="/weatherforecast" element={<WeatherForecast />} />

       <Route path="/profile" element={<Profile />} />
       <Route path="/profile_User" element={<Profile_User />} />

       <Route path="/DeviceMap" element={<DeviceMap />} />
       <Route path="/DeviceMap_User" element={<DeviceMap_User />} />

       <Route path="/Available_Inverter" element={<Available_Inverter />} />
       <Route path="/Available_Inverter_User" element={<Available_Inverter_User/>} />

       <Route path="/AddInverter" element={<AddInverter />} />

       <Route path="/Chart" element={<Chart/>} />
       <Route path="/Chart_User" element={<Chart_User/>} />

       <Route path="/support" element={<Support />} />
       <Route path="/support_User" element={<Support_User/>} />

       <Route path="/DataLog" element={<DataLog />} />

       <Route path="/AdminDashboard" element={<AdminDashboard />} />

       <Route path="/DeviceSearch" element={<DeviceSearch />} />

      <Route path="/LoadFlow_User" element={<LoadFlow_User />} />


    
      </Routes>
    </div>
  );
}

export default App;