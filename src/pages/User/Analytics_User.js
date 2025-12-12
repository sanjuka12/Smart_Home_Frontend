import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaChartLine, FaLocationArrow } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import './Analytics_User.css';
import { useRef } from 'react';


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




export default function Analytics_User() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const dropdownRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

const [chartData, setChartData] = useState([]);
const [batteryData, setBatteryData] = useState([]);

const handleAddChart = () => {
  navigate('/Chart', { 
    state: { 
      userName: username,   // match Chart_User key
      firstName: firstName,
      role: role,
      inverterAccess: inverterAccess
    } 
  });
};


useEffect(() => {
  axios.get(`${apiUrl}/solarinverterdata`)
    .then(response => {
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const formatted = response.data
        .filter(item => {
          const ts = item.timestamp;
          const date = ts && ts._seconds ? new Date(ts._seconds * 1000) : null;
          const matchesUnit = item.UnitId === inverterAccess; // <-- filter here
          return date && date >= todayMidnight && matchesUnit;
        })
        .map(item => {
          const ts = item.timestamp;
          const date = new Date(ts._seconds * 1000);
          const minutes = date.getHours() * 60 + date.getMinutes();

          return {
            time: minutes,
            timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            inverter: Number(item.solarpower) || 0,
            gridStatus: item.gridStatus,
            voltage: item.voltage,
            current: item.current,
            frequency: item.frequency
          };
        });

      setChartData(formatted);
    })
    .catch(error => {
      console.error('Error fetching inverter data:', error);
    });
}, [apiUrl, inverterAccess]); // <-- add inverterAccess as dependency

useEffect(() => {
  axios.get(`${apiUrl}/batteryinverterdata`)
    .then(response => {
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const formattedBattery = response.data
        .filter(item => {
          const ts = item.timestamp;
          const date = ts && ts._seconds ? new Date(ts._seconds * 1000) : null;
          const matchesUnit = item.UnitId === inverterAccess; // filter by inverterAccess
          return date && date >= todayMidnight && matchesUnit;
        })
        .map(item => {
          const ts = item.timestamp;
          const date = new Date(ts._seconds * 1000);
          const minutes = date.getHours() * 60 + date.getMinutes();

          return {
            time: minutes,
            timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            soc: Number(item.soc) || 0,  // Battery SOC %
            voltage: item.voltage,
            current: item.current,
            power: item.power,
            gridStatus: item.gridStatus
          };
        });

      setBatteryData(formattedBattery);
    })
    .catch(error => {
      console.error('Error fetching battery data:', error);
    });
}, [apiUrl, inverterAccess]); // add inverterAccess as dependency


  // **NEW: get current time in minutes for X axis domain**
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Helper function for formatting minutes to HH:mm string
  const formatMinutesToHHMM = (val) => {
    const h = Math.floor(val / 60);
    const m = val % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
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
          <span style={{ marginLeft: '10px' }}>Solar Monitoring Portal</span>
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
  onClick={handleAddChart}
  className="generate-chart-button"
>
  <FaChartLine /> + Generate Chart
</button>

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
          


           {/* Battery Chart */}
<div style={{ flex: 1, position: 'relative' }}>
  <div className="chart-section">
    <h2 className="chart-title">Battery Status Over Time</h2>
    {batteryData.length > 0 ? (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={batteryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            domain={[0, currentMinutes]}
            tickFormatter={formatMinutesToHHMM}
            tick={{ fontSize: 15 }}
          />
          <YAxis unit="%" tick={{ fontSize: 15 }} />
          <Tooltip labelFormatter={formatMinutesToHHMM} />
          <Legend />
          <Line
            type="monotone"
            dataKey="soc"
            stroke="blue"
            name="Battery SOC (%)"
            dot={false} // hide dots
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#4fc1e9', fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      // Watermark if no battery data
      <div
        style={{
          width: '100%',
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bbb',
          fontSize: '18px',
          fontWeight: 'bold',
          border: '1px dashed #ccc'
        }}
      >
        No Battery Data
      </div>
    )}
 
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