import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './AddInverter.css';
import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';

export default function AddInverter() {
  const [inverterData, setInverterData] = useState({
    id: '',
    brand: '',
    generationType: 'on-grid',
    lat: '',
    lng: '',
    address: '',
    capacity: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleChange = (e) => {
    setInverterData({
      ...inverterData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddInverter = (e) => {
    e.preventDefault();
    const { id, brand, generationType, lat, lng, address, capacity } = inverterData;
    if (!id || !brand || !lat || !lng || !address || !capacity) return;

    const inverterList = JSON.parse(localStorage.getItem('inverterList')) || [];
    inverterList.push({
      id,
      name: brand,
      generationType,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address,
      capacity
    });

    localStorage.setItem('inverterList', JSON.stringify(inverterList));
    navigate('/DeviceMap', { state: { username, firstName } });
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
            <div className="dropdown-menu">
              <div className="dropdown-item"><FaUserCircle className="dropdown-icon" /> Profile</div>
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item"><FaSignOutAlt className="dropdown-icon" /> Logout</div>
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

        {/* Main */}
        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Add New Inverter</h2>

            <form className="add-inverter-form" onSubmit={handleAddInverter}>
              <input
                type="text"
                name="id"
                placeholder="Inverter ID"
                value={inverterData.id}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="brand"
                placeholder="Inverter Brand"
                value={inverterData.brand}
                onChange={handleChange}
                required
              />
              <select
                name="generationType"
                value={inverterData.generationType}
                onChange={handleChange}
                required
              >
                <option value="on-grid">On-Grid</option>
                <option value="off-grid">Off-Grid</option>
              </select>
              <input
                type="number"
                step="any"
                name="lat"
                placeholder="Latitude"
                value={inverterData.lat}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                step="any"
                name="lng"
                placeholder="Longitude"
                value={inverterData.lng}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={inverterData.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="capacity"
                placeholder="Installed Capacity (kW)"
                value={inverterData.capacity}
                onChange={handleChange}
                required
              />
              <button type="submit">Add Inverter</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
