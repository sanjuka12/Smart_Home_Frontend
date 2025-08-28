import React, { useState, useEffect } from "react";
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
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [solarData, setSolarData] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allData, setAllData] = useState([]);

// Mapping gridStatus codes to text
const mapGridStatus = (statusCode) => {
  const statusMap = {
    1: "OFF",
    2: "Sleep",
    3: "Starting",
    4: "Generating",
    5: "Throttled",
    6: "Shutting Down",
    7: "Fault",
    8: "Standby"
  };
  return statusMap[statusCode] || "Unknown";
};

const mapBatteryStatus = (statusCode) => {
  const statusMap = {
    0: "Idle",
    1: "Charging",
     2: "Discharging"   
  };
  return statusMap[statusCode] || "Unknown";
};

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
    useEffect(() => {
  const fetchSolarData = async () => {
    try {
      const response = await fetch('http://localhost:3000/solarinverterdata');
      if (!response.ok) throw new Error("Failed to fetch solar inverter data");
      const data = await response.json();

      setAllData(data);        // optional, if you need combined view
      setSolarData(data);      // show all initially
    } catch (error) {
      console.error('Error fetching solar inverter data:', error);
      setErrorMessage("⚠️ Error fetching solar data. Please try again.");
    }
  };

  const fetchBatteryData = async () => {
    try {
      const response = await fetch('http://localhost:3000/batteryinverterdata');
      if (!response.ok) throw new Error("Failed to fetch battery inverter data");
      const data = await response.json();

      setBatteryData(data);    // show all initially
    } catch (error) {
      console.error('Error fetching battery inverter data:', error);
      setErrorMessage("⚠️ Error fetching battery data. Please try again.");
    }
  };

  fetchSolarData();
  fetchBatteryData();
}, []);


const handleView = () => {
  if (!selectedInverter) {
    setErrorMessage("⚠️ Please select an inverter.");
    return;
  }
  if (!selectedDuration) {
    setErrorMessage("⚠️ Please select a time duration.");
    return;
  }
  setErrorMessage("");

  const now = new Date();
  let startTime = new Date();
  switch (selectedDuration) {
    case '30min': startTime.setMinutes(now.getMinutes() - 30); break;
    case '1h': startTime.setHours(now.getHours() - 1); break;
    case '6h': startTime.setHours(now.getHours() - 6); break;
    case '12h': startTime.setHours(now.getHours() - 12); break;
    case '24h': startTime.setHours(now.getHours() - 24); break;
    case 'week': startTime.setDate(now.getDate() - 7); break;
    case 'month': startTime.setMonth(now.getMonth() - 1); break;
    default: startTime = new Date(0);
  }

  // Filter solar
  const filteredSolar = allData
    .filter(item => item.UnitId === selectedInverter)
    .filter(item => new Date(item.timestamp._seconds * 1000) >= startTime)
    .sort((a, b) => new Date(b.timestamp._seconds * 1000) - new Date(a.timestamp._seconds * 1000));

  setSolarData(filteredSolar);

  // Filter battery
  const filteredBattery = batteryData
    .filter(item => item.UnitId === selectedInverter)
    .filter(item => new Date(item.timestamp._seconds * 1000) >= startTime)
    .sort((a, b) => new Date(b.timestamp._seconds * 1000) - new Date(a.timestamp._seconds * 1000));

  setBatteryData(filteredBattery);
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
             <NavLink
                           to={role === "Administrator" ? "/AdminDashboard" : "/dashboard"}
                           state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }}
                           className="sidebar-link"
                         >
                           <FaTachometerAlt className="sidebar-icon" /> Dashboard
                         </NavLink>
                        
                         <NavLink to="/analytics1" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
                         <NavLink to="/DeviceMap" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaLocationArrow className="sidebar-icon" /> Inverter Map</NavLink>
                         <NavLink to="/Available_Inverter" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
                         <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
                         <NavLink to="/Users" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
                         <NavLink to="/Settings" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
                         <NavLink to="/support" state={{ userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
                       
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
                      <th>INV ID</th>
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
                          <td>{row.UnitId}</td>
                          <td>
  {row.timestamp?._seconds
    ? new Date(row.timestamp._seconds * 1000).toLocaleString()
    : row.timestamp}
</td>                     
                          <td>{row.voltage}</td>
                          <td>{row.current}</td>
                          <td>{row.solarpower}</td>
                          <td>{row.frequency}</td>
                          <td>{mapGridStatus(row.gridStatus)}</td>
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
                          <td>
  {row.timestamp?._seconds
    ? new Date(row.timestamp._seconds * 1000).toLocaleString()
    : row.timestamp}
</td>

                          <td>{row.voltage}</td>
                          <td>{row.current}</td>
                          <td>{row.power}</td>
                          <td>{row.soc}</td>
                          <td>{mapBatteryStatus(row.gridStatus)}</td>
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
