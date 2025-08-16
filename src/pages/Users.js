// src/pages/Users.js
import './Users.css';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers,FaUserPlus, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Users() {


  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;

const [filterDate, setFilterDate] = useState('');
const [users, setUsers] = useState([]);
const [dropdownOpen, setDropdownOpen] = useState(false); 
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      let url = 'http://localhost:3000/userlog';

      if (filterDate) {
        const formattedDate = formatDateToDDMMYYYY(filterDate);
        url += `?date=${formattedDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      // 🔽 SORTING by date + login time (descending)
      const sorted = [...data].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [hourA, minA] = a.login.split(':').map(Number);
        const dateTimeA = new Date(yearA, monthA - 1, dayA, hourA, minA);

        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const [hourB, minB] = b.login.split(':').map(Number);
        const dateTimeB = new Date(yearB, monthB - 1, dayB, hourB, minB);

        return dateTimeB - dateTimeA; // latest at top
      });

      // 🔽 Show only the latest 20 logs (even when filtered)
      const latest20 = sorted.slice(0, 20);
      setUsers(latest20);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  fetchUsers();
}, [filterDate]);



const formatDateToDDMMYYYY = (input) => {
  const date = new Date(input);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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
      <div className="user-table-wrapper">
  <div className="user-table">
    <div className="user-row header">
      <div>Date</div>
      <div>Log In</div>
      <div>Username</div>
      <div>Role</div>
    </div>
    {users.map((user, index) => (
      <div className="user-row" key={index}>
        <div>{user.date}</div>
        <div>{user.login}</div>
        <div>{user.userName}</div>
        <div className={`role ${user.role.toLowerCase()}`}>{user.role}</div>
      </div>
    ))}
  </div>
</div>
</div>
    </section>
    </main>
</div>
</div> 
  );
}
