// src/pages/Users.js
import './Users.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers,FaUserPlus, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Users() {


  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;


const [dropdownOpen, setDropdownOpen] = useState(false); 
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };



  const [filterDate, setFilterDate] = useState('');
  const [users, setUsers] = useState([
    { date: '2025-05-01', login: '10:15 AM',logout: '10:15 AM', username: 'admin', role: 'Administrator' },
    { date: '2025-05-02', login: '09:45 AM', logout: '10:15 AM', username:'john_doe', role: 'Technician' },
    { date: '2025-05-03', login: '11:00 AM',logout: '10:15 AM', username:'sarah', role: 'Viewer' },
    // Add more mock data as needed
  ]);

  const filteredUsers = users.filter(user => !filterDate || user.date === filterDate);

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
  <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
  <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
  <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
  <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
  <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
</nav>
        </aside>

        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">User Management</h2>


    <div className="users-container">
     
      <div className="users-controls">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-filter"
          
        />
        <button className="add-user-btn">
  <FaUserPlus style={{fontSize: '20px',marginRight: '8px', color: 'white' }} />
  Add User
</button>
      </div>
      <div className="user-table">
        <div className="user-row header">
          <div>Date</div>
          <div>Log In</div>
          <div>Log Out</div>
          <div>Username</div>
          <div>Role</div>
        </div>
        {filteredUsers.map((user, index) => (
          <div className="user-row" key={index}>
            <div>{user.date}</div>
            <div>{user.login}</div>
            <div>{user.logout}</div>
            <div>{user.username}</div>
            <div className={`role ${user.role.toLowerCase()}`}>{user.role}</div>
          </div>
        ))}
      </div>
    </div>
    </section>
    </main>
</div>
</div> 
  );
}
