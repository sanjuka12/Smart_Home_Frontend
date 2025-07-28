import { useLocation } from 'react-router-dom';
import './Maintenance.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const mockAlarms = [
  { id: 1, time: '2025-05-05 09:32', inverter: 'Inverter A', message: 'Overtemperature detected', severity: 'High' },
  { id: 2, time: '2025-05-05 08:45', inverter: 'Inverter B', message: 'Voltage fluctuation', severity: 'Medium' },
  { id: 3, time: '2025-05-04 18:17', inverter: 'Inverter C', message: 'Grid disconnect', severity: 'Critical' },
];

export default function Maintenance() {


  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

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
            <h2 className="section-title">Maintenance & Alerts</h2>


            {/* Top Row: Battery and Inverter Side by Side */}


      <div className="alarm-table">
        <div className="alarm-header">
          <div>Time</div>
          <div>Inverter</div>
          <div>Message</div>
          <div>Severity</div>
        </div>
        {mockAlarms.map((alarm) => (
          <div key={alarm.id} className={`alarm-row ${alarm.severity.toLowerCase()}`}>
            <div>{alarm.time}</div>
            <div>{alarm.inverter}</div>
            <div>{alarm.message}</div>
            <div>{alarm.severity}</div>
          </div>
        ))}
      </div>
      </section>
      </main>
    </div>
    </div>
  );
}
