import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaChartLine, FaLocationArrow } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import './Analytics.css';
import { useNavigate } from 'react-router-dom';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Analytics() {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [chartData, setChartData] = useState([]);

 useEffect(() => {
  axios.get('http://localhost:3000/solarinverterdata')
    .then(response => {
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const formatted = response.data
        .filter(item => {
          const ts = item.timestamp;
          const date = ts && ts._seconds ? new Date(ts._seconds * 1000) : null;
          return date && date >= todayMidnight;
        })
        .map(item => {
          const ts = item.timestamp;
          const date = new Date(ts._seconds * 1000);  // convert Firestore timestamp to JS Date
          const minutes = date.getHours() * 60 + date.getMinutes();

          return {
            time: minutes,
            timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            inverter: Number(item.solarpower) || 0,
            battery: 60 + Math.floor(Math.random() * 20), // Dummy battery %
            load: 500 + Math.floor(Math.random() * 2000), // Dummy load
            gridStatus: item.gridStatus,
            voltage: item.voltage,
            current: item.current,
            frequency: item.frequency
          };
        });
console.log("Final chartData:", formatted);
      setChartData(formatted);
    })
    .catch(error => {
      console.error('Error fetching inverter data:', error);
    });
}, []);


  // **NEW: get current time in minutes for X axis domain**
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Helper function for formatting minutes to HH:mm string
  const formatMinutesToHHMM = (val) => {
    const h = Math.floor(val / 60);
    const m = val % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
              <div className="dropdown-item" onClick={handleLogout}>
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
            <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
            <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
            <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
            <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
            <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
          </nav>
        </aside>

        {/* Main Section */}
        <main className="dashboard-main">
          <section className="yield-section">
          <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  borderBottom: '2px solid #ccc',  // <-- this creates the underline
  paddingBottom: '10px',
  marginBottom: '10px',
  paddingRight: '5px',
 
 
}}>
  <h2 className="section-title" style={{ margin: 0 }}>Analytics / Reports</h2>

  <button
  onClick={() => console.log('Generate Chart clicked')}
  className="generate-chart-button"
>
  <FaChartLine /> + Generate Chart
</button>

</div>



            {/* Top Row: Battery and Inverter Side by Side */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              {/* Battery Chart */}
              <div style={{ flex: 1 }}>
                <div className="chart-section">
                  <h2 className="chart-title">Battery Status Over Time</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"  // numeric minutes
                        type="number"   // **CHANGED TO number for continuous range**
                        domain={[0, currentMinutes]}  // **set domain from midnight to now**
                        tickFormatter={formatMinutesToHHMM}  // format ticks back to HH:mm
                        tick={{ fontSize: 15 }}
                      />
                      <YAxis unit="%" tick={{ fontSize: 15 }} />
                      <Tooltip labelFormatter={formatMinutesToHHMM} />
                      <Legend />
                      <Line 
  type="monotone" 
  dataKey="battery" 
  stroke="Blue" 
  name="Battery Percentage (%)" 
  dot={false}                 // hides all dots
  activeDot={{ r: 6, strokeWidth: 2, stroke: '#4fc1e9', fill: 'white' }}  // visible on hover with styling
/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inverter Chart */}
              <div style={{ flex: 1 }}>
                <div className="chart-section">
                  <h2 className="chart-title">Inverter Output Over Time</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        type="number"   // **CHANGED TO number**
                        domain={[0, currentMinutes]}  // **domain set**
                        tickFormatter={formatMinutesToHHMM}
                        tick={{ fontSize: 15 }}
                      />
                      <YAxis unit="W" tick={{ fontSize: 15 }} />
                      <Tooltip labelFormatter={formatMinutesToHHMM} />
                      <Legend />
                      <Line 
  type="monotone" 
  dataKey="inverter" 
  stroke="red" 
  name="Inverter Output (W)" 
  dot={false}                 // hides all dots
  activeDot={{ r: 6, strokeWidth: 2, stroke: '#4fc1e9', fill: 'white' }}  // visible on hover with styling
/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Row: Load Chart Full Width */}
            <div className="chart-section-load">
              <h2 className="chart-title">Load Consumption Over Time</h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    type="number"   // **CHANGED TO number**
                    domain={[0, currentMinutes]}  // **domain set**
                    tickFormatter={formatMinutesToHHMM}
                    tick={{ fontSize: 15 }}
                  />
                  <YAxis unit="W" tick={{ fontSize: 15 }} />
                  <Tooltip labelFormatter={formatMinutesToHHMM} />
                  <Legend />
                  <Line 
  type="monotone" 
  dataKey="load" 
  stroke="green" 
  name="Load Consumption (W)" 
  dot={false}                 // hides all dots
  activeDot={{ r: 6, strokeWidth: 2, stroke: '#4fc1e9', fill: 'white' }}  // visible on hover with styling
/>
                </LineChart>
              </ResponsiveContainer>
            </div>

          </section>
        </main>

      </div> {/* end dashboard-content */}
    </div> /* end dashboard-container */
  );
}