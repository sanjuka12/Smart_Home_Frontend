
import { NavLink } from "react-router-dom";
import "./Devices.css";
import React, { useState } from "react";
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Devices = () => {

  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;



  // Dummy data
  const batteryInverter = {
    status: "Charging",
    communication: "Connected",
    acPowerOutput: "3.2 kW",
    acOutputVoltage: "230 V",
    batteryCharge: "85%",
    batteryVoltage: "48 V",
    batteryCurrent: "66.6 A",
  };

  const solarInverter = {
    status: "Gen",
    communication: "Connected",
    acPowerOutput: "4.5 kW",
    acOutputVoltage: "230 V",
    acOutputCurrent: "19.5 A",
    panelVoltage: "360 V",
  };

    const [dropdownOpen, setDropdownOpen] = useState(false); 
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

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
                    <span style={{ marginLeft: '10px' }}>Solar Monitoring System</span>
                  </h1>
            
                  <div className="user-profile">
                    <FaBell className="notification-icon" />
                    <span className="user-name">{firstName}</span>
                    <FaUserCircle className="profile-icon" />
                    <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>
            
                    {dropdownOpen && (
                      <div className="dropdown-menu">
            <div className="dropdown-item">
                <FaUserCircle className="dropdown-icon" />
                Profile
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

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">All Places</h2>
  <nav className="sidebar-nav">
 <NavLink to="/dashboard" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTachometerAlt className="sidebar-icon" /> Dashboard</NavLink>
  <NavLink to="/analytics1" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
  <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
  <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
  <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
  <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
  <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
</nav>
        </aside>

        <div className="device-container">
          <div className="inverter-card battery-inverter">
            <h2>Battery Inverter</h2>
            <div className="inverter-status">Status: <span className={`status ${batteryInverter.status.toLowerCase()}`}>{batteryInverter.status}</span></div>
            <div className="comm-status">Communication: <span className={batteryInverter.communication === "Connected" ? "connected" : "disconnected"}>{batteryInverter.communication}</span></div>
            <div className="param">AC Power Output: {batteryInverter.acPowerOutput}</div>
            <div className="param">AC Output Voltage: {batteryInverter.acOutputVoltage}</div>
            <div className="param">Battery Charge: {batteryInverter.batteryCharge}</div>
            <div className="param">Battery DC Voltage: {batteryInverter.batteryVoltage}</div>
            <div className="param">Battery DC Current: {batteryInverter.batteryCurrent}</div>
          </div>

          <div className="inverter-card solar-inverter">
            <h2>Solar Inverter</h2>
            <div className="inverter-status">Status: <span className={`status ${solarInverter.status.toLowerCase()}`}>{solarInverter.status}</span></div>
            <div className="comm-status">Communication: <span className={solarInverter.communication === "Connected" ? "connected" : "disconnected"}>{solarInverter.communication}</span></div>
            <div className="param">AC Power Output: {solarInverter.acPowerOutput}</div>
            <div className="param">AC Output Voltage: {solarInverter.acOutputVoltage}</div>
            <div className="param">AC Output Current: {solarInverter.acOutputCurrent}</div>
            <div className="param">Panel DC Voltage: {solarInverter.panelVoltage}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
