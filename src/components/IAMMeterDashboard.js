// src/IAMMeterDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import "./IAMMeterDashboard.css";
import PowerChart from "./PowerChart";
import PowerFlowDiagram from './PowerFlowDiagram';
import EnergyAnalysis from './EnergyAnalysis';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WeatherForecast from "./weatherforecast";
import Profile from "../pages/Profile";
import { FaLocationArrow } from "react-icons/fa6";


export default function IAMMeterDashboard() {

  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);


   const [notifications] = useState([
    { id: 1, message: 'Inverter voltage high', time: '5 mins ago' },
    { id: 2, message: 'Battery at 90%', time: '10 mins ago' },
    { id: 3, message: 'System check completed', time: '1 hour ago' },
  ]);


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

useEffect(() => {
  const handleClickOutside = (event) => {
    const isClickInsideNotification = notificationRef.current?.contains(event.target);
    const isClickInsideDropdown = dropdownRef.current?.contains(event.target);
    const isBellIcon = event.target.classList.contains('notification-icon');
    const isDropdownArrow = event.target.classList.contains('dropdown-arrow');

    if (!isClickInsideNotification && !isBellIcon) {
      setNotificationsVisible(false);
    }

    if (!isClickInsideDropdown && !isDropdownArrow) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
const navigate = useNavigate();
const handleLogout = () => {
  // clear tokens or session here if any
  navigate('/Loginpage');
};

  return (
    <div className="dashboard-container">
<header className="dashboard-header">
      <h1 className="dashboard-title">
        <img src="/assets/Dashboard.png" alt="Solar Icon" className="dashboard-icon" />
        <span style={{ marginLeft: '10px' }}>SUNWIZ</span>
        <span style={{ marginLeft: '10px' }}>Solar Monitoring Portal</span>
      </h1>

      <div className="user-profile">
           <FaBell 
            className="notification-icon" 
            onClick={() => setNotificationsVisible(!notificationsVisible)} // ✅ UPDATED
          />
        <span className="user-name">{firstName}</span>
        <FaUserCircle className="profile-icon" />
        <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>

        {dropdownOpen && (
           <div className="dropdown-menu" ref={dropdownRef}>
<div className="dropdown-item" onClick={() => navigate('/profile', {
  state: { username, firstName }
})}>
  <FaUserCircle className="dropdown-icon" /> Profile
</div>
  <div className="dropdown-item">
    <FaCog className="dropdown-icon" />
    Settings
  </div>
  <div className="dropdown-item"onClick={handleLogout}>
    <FaSignOutAlt className="dropdown-icon" />
    Logout
  </div>
          </div>
        )}

{notificationsVisible && (
          <div className="notification-panel" ref={notificationRef}> {/* ✅ Step 3 */}
            <h4 className="notification-title">
              <FaBell className="bell-icon-left" /> Notifications
            </h4>
            {notifications.length > 0 ? (
  <>
    <ul className="notification-list">
      {notifications.map(note => (
        <li key={note.id} className="notification-item">
          <span className="notification-message">{note.message}</span>
          <span className="notification-time">{note.time}</span>
        </li>
      ))}
    </ul>
    <button className="clear-all-button" onClick={() => notifications([])}>
      Clear All
    </button>
  </>
) : (
  <div className="notification-empty">No new notifications</div>
)}

          </div>
        )}
  </div>
    </header>
      <div className="dashboard-content">
      <aside className="dashboard-sidebar">
  <h2 className="sidebar-title">All Places</h2>
  <nav className="sidebar-nav">
  <NavLink to="/dashboard" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTachometerAlt className="sidebar-icon" /> Dashboard</NavLink>
  <NavLink to="/analytics1" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
  <NavLink to="/DeviceMap" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaLocationArrow className="sidebar-icon" /> Inverter Map</NavLink>
  <NavLink to="/Available_Inverter" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
  <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
  <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
  <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
  <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
</nav>
</aside>


        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Yield & Consumption</h2>
            <div className="power-layout">
              <PowerFlowDiagram />
              <div className="weather-forecast-wrapper">
  <WeatherForecast small />
</div>
              <div className="power-and-analysis-container">
              <PowerChart />
              <EnergyAnalysis />

</div>

  </div>
    
          </section>
        </main>
      </div>
    </div>
  );
}