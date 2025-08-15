import React, { useState } from "react";
import "./DataLog.css";
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, 
  FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';

export default function DataLog() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [solarData, setSolarData] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
    
const handleView = async () => {
  if (!selectedInverter) {
    setErrorMessage("⚠️ Please select an inverter.");
    return;
  }

  if (!selectedDuration) {
    setErrorMessage("⚠️ Please select a time duration.");
    return;
  }

  setErrorMessage("");

  try {
    const response = await fetch('http://localhost:3000/solarinverterdata');
    if (!response.ok) throw new Error("Failed to fetch inverter data");
    const allData = await response.json();

    // Filter by selected inverter
    const inverterData = allData.filter(item => item.UnitId === selectedInverter);

    // Calculate start time based on selected duration
    const now = new Date();
    let startTime = new Date();

    switch (selectedDuration) {
      case '30min':
        startTime.setMinutes(now.getMinutes() - 30);
        break;
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '6h':
        startTime.setHours(now.getHours() - 6);
        break;
      case '12h':
        startTime.setHours(now.getHours() - 12);
        break;
      case '24h':
        startTime.setHours(now.getHours() - 24);
        break;
      case 'week':
        startTime.setDate(now.getDate() - 7);
        break;
      case 'month':
        startTime.setMonth(now.getMonth() - 1);
        break;
      default:
        startTime = new Date(0); // fallback: include all
    }

    // Filter by duration
    const filteredData = inverterData.filter(item => new Date(item.timestamp) >= startTime);

    // Sort newest first
    const sortedData = filteredData.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setSolarData(sortedData); // set for solar inverter table
    // If you also have battery data in the same endpoint, do similar filtering for battery
    setBatteryData(sortedData); // or replace with actual battery data

  } catch (error) {
    console.error('Error fetching inverter data:', error);
    setErrorMessage("⚠️ Error fetching data. Please try again.");
  }
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
                <FaUserCircle className="dropdown-icon" /> Profile
              </div>
              <div className="dropdown-item">
                <FaCog className="dropdown-icon" /> Settings
              </div>
              <div className="dropdown-item">
                <FaSignOutAlt className="dropdown-icon" /> Logout
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

        {/* Main */}
        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Data Log</h2>

            {/* Filter Controls */}
            <div className="filter-container">
              <label htmlFor="inverterSelect">Select Inverter:</label>
              <select id="inverterSelect" className="filter-select" value={selectedInverter} onChange={(e) => setSelectedInverter(e.target.value)}>
                <option value="">-- Select Inverter --</option>
                <option value="inverter1">INV001</option>
                <option value="inverter2">Inverter 2</option>
                <option value="inverter3">Inverter 3</option>
              </select>

              <label htmlFor="timeSelect">Select Time Duration:</label>
              <select 
                id="timeSelect" 
                className="filter-select"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                <option value="">-- Select Duration --</option>
                <option value="30min">Last 30 min</option>
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="12h">Last 12 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>

              <button className="view-btn" onClick={handleView}>View</button>
            </div>

            {/* Tables Container */}
            <div className="tables-container">
              {/* Solar Inverter Table */}
              <div className="table-section">
                <h3>Solar Inverter</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Voltage (V)</th>
                      <th>Current (A)</th>
                      <th>Power (W)</th>
                      <th>Frequency (Hz)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solarData.length > 0 ? (
                      solarData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.timestamp}</td>
                          <td>{row.voltage}</td>
                          <td>{row.current}</td>
                          <td>{row.power}</td>
                          <td>{row.frequency}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Battery Inverter Table */}
              <div className="table-section">
                <h3>Battery Inverter</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Voltage (V)</th>
                      <th>Current (A)</th>
                      <th>Power (W)</th>
                      <th>State of Charge (%)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batteryData.length > 0 ? (
                      batteryData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.timestamp}</td>
                          <td>{row.voltage}</td>
                          <td>{row.current}</td>
                          <td>{row.power}</td>
                          <td>{row.stateOfCharge}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {errorMessage && (<p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>)}
          </section>
        </main>
      </div>
    </div>
  );
}
