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
    
  const handleView = () => {
    /*if (!selectedInverter || !selectedDuration) {
      alert("Please select both inverter and time duration");
      return;
    }*/
    if (!selectedInverter) {
        setErrorMessage("⚠️ Please select an inverter.");
        return;
    }

    if (!selectedDuration) {
        setErrorMessage("⚠️ Please select a time duration.");
        return;
    } 

    setErrorMessage("");

    /*fetch(`/api/solar-data?inverter=${selectedInverter}&duration=${selectedDuration}`)
        .then(res => res.json())
        .then(data => {
          // Sort so newest first
          const sortedSolar = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setSolarData(sortedSolar);
        });

      fetch(`/api/battery-data?inverter=${selectedInverter}&duration=${selectedDuration}`)
        .then(res => res.json())
        .then(data => {
          const sortedBattery = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setBatteryData(sortedBattery);
        });*/

    // Dummy Solar Data
    const dummySolar = [
      { timestamp: "2025-08-10 14:20:10", voltage: 230, current: 5.2, power: 1196, frequency: 50, status: "Active" },
      { timestamp: "2025-08-10 14:10:10", voltage: 229, current: 5.1, power: 1167, frequency: 50, status: "Active" },
      { timestamp: "2025-08-10 14:00:10", voltage: 228, current: 5.0, power: 1140, frequency: 50, status: "Active" },
    ];

    // Dummy Battery Data
    const dummyBattery = [
      { timestamp: "2025-08-10 14:20:10", voltage: 48.5, current: 3.8, power: 184, stateOfCharge: 78, status: "Charging" },
      { timestamp: "2025-08-10 14:10:10", voltage: 48.3, current: 3.6, power: 173, stateOfCharge: 77, status: "Charging" },
      { timestamp: "2025-08-10 14:00:10", voltage: 48.1, current: 3.5, power: 169, stateOfCharge: 76, status: "Charging" },
    ];

    setSolarData(dummySolar);
    setBatteryData(dummyBattery);
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
                <option value="inverter1">Inverter 1</option>
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
