import { useLocation } from 'react-router-dom';
import './Maintenance_User.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



export default function Maintenance_User() {


  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;

   const [alarms, setAlarms] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

const [dropdownOpen, setDropdownOpen] = useState(false); 
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };


    const navigate = useNavigate();
    const handleLogout = () => {
      // clear tokens or session here if any
      navigate('/Loginpage');
    };

useEffect(() => {
  const fetchAlarms = async () => {
    try {
      const response = await fetch(`${apiUrl}/maintenance`);
      const data = await response.json();
      console.log("Fetched maintenance logs:", data);
      setAlarms(data);
    } catch (error) {
      console.error("Failed to fetch maintenance data:", error);
    }
  };

  fetchAlarms();
}, []);


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
              <div className="dropdown-item" onClick={() => navigate('/Profile_User', {state: {userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess}})}>
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

      {/* Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">All Places</h2>
  <nav className="sidebar-nav">
<NavLink
              to={role === "Administrator" ? "/AdminDashboard" : "/dashboard"}
              state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }}
              className="sidebar-link"
            >
              <FaTachometerAlt className="sidebar-icon" /> Dashboard
            </NavLink>
            
              <NavLink to="/analytics1_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
              <NavLink to="/Devices_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaLocationArrow className="sidebar-icon" /> Generation Status</NavLink>
              <NavLink to="/Available_Inverter_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Inverter Status</NavLink>
               <NavLink to="/LoadFlow_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Load Management</NavLink>
              <NavLink to="/Maintenance_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
              <NavLink to="/Settings_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
              <NavLink to="/support_User" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
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
        {alarms
  .filter((alarm) => alarm.InverterId === inverterAccess)
  .map((alarm) => (

<div key={alarm.id} className={`alarm-row ${alarm.severity?.toLowerCase()}`}>
    <div>{alarm.createdAt ? new Date(alarm.createdAt._seconds * 1000).toLocaleString() : "—"}</div>
    <div>{alarm.InverterId}</div>
    <div>{alarm.Message}</div>
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
