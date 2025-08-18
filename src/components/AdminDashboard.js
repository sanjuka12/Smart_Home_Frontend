
import React, { useState, useRef, useEffect } from "react";
import "./AdminDashboard.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaTachometerAlt, FaLocationArrow } from 'react-icons/fa';
import AdminPowerFlowDiagram from "../components/AdminPowerFlowDiagram";
import AdminPowerChart from "../components/AdminPowerChart";
import AdminWeatherforecast from "../components/AdminWeatherforecast";
import AdminSummary from "../components/AdminSummary";
import Profile from "../pages/Profile";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function AdminDashboard() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  const role = location.state?.role;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [notifications] = useState([
      { id: 1, message: 'Inverter voltage high', time: '5 mins ago' },
      { id: 2, message: 'Battery at 90%', time: '10 mins ago' },
      { id: 3, message: 'System check completed', time: '1 hour ago' },
    ]);
  
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

const solarGenData = { solargenpower: 350 }; // example: 350 W
  const solarGenMax = 1000; // example maximum value
     


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
          <FaBell className="notification-icon" onClick={() => setNotificationsVisible(!notificationsVisible)} />
          <span className="user-name">{firstName}</span>
          <FaUserCircle className="profile-icon" />
          <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>

          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <div className="dropdown-item" onClick={() => navigate('/Profile', {state: { username, firstName }})}>
                <FaUserCircle className="dropdown-icon" />
                Profile
              </div>
              <div className="dropdown-item">
                <FaCog className="dropdown-icon" />
                Settings
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
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

      {/* Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">All Places</h2>
          <nav className="sidebar-nav">
            <NavLink to="/AdminDashboard" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTachometerAlt className="sidebar-icon" /> Dashboard</NavLink>
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

    <div className="admin-cards-container">
      <div className="admin-dashboard-card">
        <div className="card1-container">
          {/* Left: Power Flow */}
          <div className="powerflow-wrapper">
            <AdminPowerFlowDiagram />
          </div>

          {/* Right: Gauge */}
          <div className="gen-gauge-wrapper" style={{ width: "100%", maxWidth: "200px", aspectRatio: "1 / 1" }}>
  <div style={{ width: "100%", height: "100%" }}>
    <CircularProgressbarWithChildren
      value={solarGenData?.solargenpower}
      maxValue={solarGenMax}
      styles={buildStyles({
        pathColor: "#6006B6",
        trailColor: "#e5e7eb",
        pathTransitionDuration: 0.8,
      })}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontWeight: "bold",
       
      }}>
        {/* Title */}
        <span style={{ fontSize: "100%", color: "#000000ff", marginBottom: "2%", fontWeight: "normal"}}>
          Current 
        </span>
        <span style={{ fontSize: "100%", color: "#000000ff", marginBottom: "10%", fontWeight: "normal" }}>
          Generation
        </span>

        {/* Value + Unit inline */}
        <span style={{ fontSize: "150%", color: "#000", display: "flex", alignItems: "baseline", gap: "1%" }}>
          {solarGenData?.solargenpower.toFixed(0)}
          <span style={{ fontSize: "100%", color: "#000000ff" }}>W</span>
        </span>
      </div>
    </CircularProgressbarWithChildren>
  </div>



</div>

      
        </div>
      </div>

<div className="admin-dashboard-card">
       <AdminSummary/>
      </div>
      <div className="admin-dashboard-card">
        <AdminWeatherforecast/>
      </div>
      <div className="admin-dashboard-card">
         <AdminPowerChart/>
      </div>
      
    </div>
  </section>
</main>

      </div>
    </div>
  );
}
