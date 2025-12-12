/*import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './AddUser.css';

import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';


export default function AddUser() {
  const location = useLocation();
  const username = location.state?.useName;
  const firstName = location.state?.firstName;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  

 

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
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
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item" onClick={handleLogout}><FaSignOutAlt className="dropdown-icon" /> Logout</div>
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
            <h2 className="section-title">Add Users</h2>


            
          </section>
        </main>
      </div>
    </div>
  );
}*/

import React, { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './AddUser.css';

import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow, FaUserPlus
} from 'react-icons/fa';

import { Eye, EyeOff } from "lucide-react";

export default function AddUser() {
  const location = useLocation();
  const username = location.state?.useName;
  const firstName = location.state?.firstName;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // form states
  const [formData, setFormData] = useState({
    newUsername: '',
    password: '',
    role: '',
    inverterAccess: '',
    city: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    navigate('/Loginpage');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    if (!formData.newUsername || !formData.password) {
      alert("Username and Password are required.");
      return;
    }
    alert("User added successfully!");
    console.log("User Data:", formData);
  };

  const isAdmin = formData.role === "administrator";

  return (
    <div className="dashboard-container">
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
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item" onClick={handleLogout}><FaSignOutAlt className="dropdown-icon" /> Logout</div>
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
            <h2 className="section-title">Add Users</h2>

            <form className="add-user-form">
              <label>Username*</label>
              <input
                type="text"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                required
              />

              <labelmore>Password*</labelmore>
              
<div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <span
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </span>
</div>


              <labelmore>User Role</labelmore>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="administrator">Administrator</option>
                <option value="user">User</option>
              </select>

              <label>Inverter Access</label>
              <input
                type="text"
                name="inverterAccess"
                value={formData.inverterAccess}
                onChange={handleChange}
                disabled={isAdmin}
                className={isAdmin ? "disabled-field" : ""}
              />

              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isAdmin}
                className={isAdmin ? "disabled-field" : ""}
              />

              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isAdmin}
                className={isAdmin ? "disabled-field" : ""}
              />

              <button type="button" onClick={handleAddUser} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <FaUserPlus /> Add User
</button>

            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

