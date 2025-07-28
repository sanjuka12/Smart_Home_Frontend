import React, { useState } from "react";
import "./Available_Inverter.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaTrashAlt, FaLocationArrow } from 'react-icons/fa';

export default function Available_Inverter() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
const navigate = useNavigate();

  const [inverters, setInverters] = useState([
    { unitID: "00101", name: "ABB", type: "SPsolar", location: "Galle", status: "Gen", generation: "3 kW" },
    { unitID: "00102", name: "ABB", type: "Hybrid", location: "Matara", status: "Idle", generation: "2.5 kW" },
    { unitID: "00103", name: "ABB", type: "String", location: "Kandy", status: "Gen", generation: "4.1 kW" },
    { unitID: "00104", name: "ABB", type: "Micro", location: "Jaffna", status: "Fault", generation: "0 kW" },
  ]);

  const handleAddInverter = () => {
    navigate('/AddInverter', { state: { username, firstName } });
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
              <div className="dropdown-item">
                <FaUserCircle className="dropdown-icon" />
                Profile
              </div>
              <div className="dropdown-item">
                <FaCog className="dropdown-icon" />
                Settings
              </div>
              <div className="dropdown-item">
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
            <h2 className="section-title">Inverter List</h2>

            {/* Add Button */}
            <div className="add-inverter-container">
              <button className="add-inverter-button" onClick={handleAddInverter}><span className="plus-sign">+</span>Add Inverter</button>
            </div>

            <div className="inverter-page">
              <div className="list-card">
                <table>
                  <thead>
                    <tr style={{ backgroundColor: "#0310c3ff", color:"#ffffff" }}>
                      <th>Unit ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Generation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inverters.map((inv, idx) => (
                      <tr key={idx}>
                        <td>{inv.unitID}</td>
                        <td>{inv.name}</td>
                        <td>{inv.type}</td>
                        <td>{inv.location}</td>
                        <td>{inv.status}</td>
                        <td>{inv.generation}</td>
                        <td className="actions">
                          <FaEye title="View" />
                          <FaEdit title="Edit" />
                          <FaTrashAlt title="Delete" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
