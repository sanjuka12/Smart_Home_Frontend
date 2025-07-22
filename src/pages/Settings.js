// src/pages/Settings.js
import { useLocation } from 'react-router-dom';
import './Settings.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Settings() {

  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  
  
  const [dropdownOpen, setDropdownOpen] = useState(false); 
    
      const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
      };
  
  
    const [darkMode, setDarkMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match!');
      return;
    }
    // Add real logic to change password
    setMessage('Password changed successfully.');
  };
const navigate = useNavigate();
  const handleLogout = () => {
    // Add logout logic (e.g., clearing token, redirecting)
    navigate('/Loginpage');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };


  return (

    <div className="dashboard-container">
          {/* Header */}
          <header className="dashboard-header">
                <h1 className="dashboard-title">
                  <img src="/assets/Dashboard.png" alt="Solar Icon" className="dashboard-icon" />
                  <span style={{ marginLeft: '10px' }}>SUNWIZ</span>
                  <span style={{ marginLeft: '10px' }}>Solar Monitoring Portal</span>
                </h1>
          
                <div className="user-profile">
                  <FaBell className="notification-icon" />
                  <span className="user-name">{firstName}</span>
                  <FaUserCircle className="profile-icon" />
                  <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>
          
                  {dropdownOpen && (
                    <div className="dropdown-menu">
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
                </div>
              </header>
    
          {/* Content */}
          <div className="dashboard-content">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
              <h2 className="sidebar-title">All Places</h2>
      <nav className="sidebar-nav">
 <NavLink to="/dashboard" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTachometerAlt className="sidebar-icon" /> Dashboard</NavLink>
  <NavLink to="/analytics1" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
  <NavLink to="/inverterMap" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaLocationArrow className="sidebar-icon" /> Inverter Map</NavLink>
  <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
  <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
  <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
  <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
  <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
    </nav>
            </aside>
    
    <main className="dashboard-main">
        <section className="yield-section">
            <h2 className="section-title">Settings</h2>


    <div className="settings-container">
     

      <div className="settings-section">
    

      <div className="setting-toggle-container">
      <h3 className="setting-title">Dark Mode</h3>
  <p className="setting-description">Toggle to switch between light and dark themes for better viewing comfort.</p>
  <label className="switch">
    <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
    <span className="slider round"></span>
    
  </label>
  
</div>

<div className="setting-toggle-container">
<h3 className="setting-title">Change Password</h3>
  <p className="password-description">Use this option to update your account password. This helps keep your account secure and prevents unauthorized access.</p>

  
</div>

      </div>

      <div className="settings-section">
    
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
        {message && <p className="settings-message">{message}</p>}
      </div>

      <div className="settings-section">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
    </section>
    </main>

    </div>
    </div>
  );
}
