import { useLocation } from 'react-router-dom';
import './Support_User.css';
import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaEnvelope, FaPhoneAlt, FaLocationArrow
} from 'react-icons/fa';

export default function Support_User() {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
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
          <span style={{ marginLeft: '10px' }}>Solar Monitoring System</span>
        </h1>
        <div className="user-profile">
          <FaBell className="notification-icon" />
          <span className="user-name">{firstName}</span>
          <FaUserCircle className="profile-icon" />
          <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>
          {dropdownOpen && (
                              <div className="dropdown-menu" ref={dropdownRef}>
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

        {/* Main Content */}
        <main className="dashboard-main">
          <section className="support-section">
            <h2 className="section-title"> Support / Help</h2>
            <div className="support-cards">
              <div className="support-card">
                <div className="support-icon"><FaQuestionCircle /></div>
                <div className="support-text">
                  <h3>Support Center</h3>
                  <p>Get quick answers for your questions with our FAQs.</p>
                </div>
                <a href="/faq" className="support-button">Find Answers</a>
              </div>

              <div className="support-card">
                <div className="support-icon"><FaEnvelope /></div>
                <div className="support-text">
                  <h3>Email Us</h3>
                  <p>support@sunwiz.com</p>
                  <small>Feel free to reach out via email.We are here to help and will get back to you as soon as possible.</small>
                </div>
                <a href="mailto:support@sunwiz.com" className="support-button">Email Us</a>
              </div>

              <div className="support-card">
                <div className="support-icon"><FaPhoneAlt /></div>
                <div className="support-text">
                  <h3>Call or Text Us</h3>
                  <p> +94 77 282 5550</p>
                </div>
                <a href="tel:18443737459" className="support-button">Call Us</a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
