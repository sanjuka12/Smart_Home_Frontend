import React, { useState,  useEffect } from "react";
import "./Chart_User.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaTachometerAlt, FaLocationArrow } from 'react-icons/fa';
import { Line } from "react-chartjs-2";

import axios from "axios";
import { useCallback } from "react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TimeScale // <-- add this
} from 'chart.js';

import 'chartjs-adapter-date-fns'; // <-- date adapter for time axis


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, TimeScale);


export default function Chart_User() {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;

  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [Inverters, setInverters] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // default today

const parseTimestamp = (ts) => {
  if (!ts) return null;
  if (ts._seconds) return new Date(ts._seconds * 1000);
  return new Date(ts);
};


  const handleGenerateChart = useCallback(async () => {
    if (!Inverters) {
        setErrorMessage("⚠️ Please select an inverter type.");
        return;
    }
    if (xAxis === yAxis) {
        setErrorMessage("⚠️ X-axis and Y-axis cannot be the same.");
        return;
    }

    setErrorMessage("");
    const data = await fetchChartData();
    if (!data || data.length === 0) {
        setErrorMessage("No data available for the selected inverter and date.");
        setShowChart(false);
        return;
    }

    // Prepare X and Y values
// Prepare X and Y values using timestamp strings
const xValues = data.map(item => xAxis === "time" 
    ? parseTimestamp(item.timestamp) 
    : Number(item[xAxis] || 0)
);

const chartPoints = data.map(item => ({
    x: xAxis === "time" ? parseTimestamp(item.timestamp) : Number(item[xAxis] || 0),
    y: Number(item[yAxis] || 0)
})).sort((a,b) => a.x - b.x);


const yValues = data.map(item => Number(item[yAxis] || 0));

    // Auto min/max
    const xMin = xAxis === "time" ? Math.min(...xValues.map(d => d.getTime())) : Math.min(...xValues);
    const xMax = xAxis === "time" ? Math.max(...xValues.map(d => d.getTime())) : Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

setChartData({
    datasets: [{
        //label: `${yAxis} vs ${xAxis}`,
        label: `${yAxis} vs ${xAxis} (Last 24 hours)`,
        data: chartPoints,
        borderColor: 'rgba(245, 3, 3, 1)',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        dots:false
    }]
});

    setChartOptions({
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `${yAxis.toUpperCase()} vs ${xAxis.toUpperCase()}` },
        },
        scales: {
x: {
    type: xAxis === "time" ? "time" : "linear",
    time: xAxis === "time" ? { unit: 'hour', displayFormats: { hour: 'HH:mm' } } : undefined,
    title: { display: true, text: xAxis.toUpperCase() },

    // ✅ FIX: Only apply min/max when X-axis is time
    min: xAxis === "time" ? xMin : undefined,
    max: xAxis === "time" ? xMax : undefined
},
            y: {
                title: { display: true, text: yAxis.toUpperCase() },
                min: yMin,
                max: yMax
            }
        }
    });

    setShowChart(true);
},[Inverters, xAxis, yAxis, selectedDate]);



useEffect(() => {
  if (Inverters && xAxis && yAxis && selectedDate) {
    handleGenerateChart();
  }
}, [handleGenerateChart]);

  const fetchChartData = async () => {
    if (!Inverters || !selectedDate) return [];
    try {
        const inverterDataResp = await axios.get(`${process.env.REACT_APP_API_URL}/solarinverterdata`);
        let filtered = inverterDataResp.data.filter(item => item.UnitId === Inverters);

        // If X-axis is time, get last 24 hours
        if (xAxis === "time") {
            const now = new Date();
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filtered = filtered.filter(item => {
                const ts = item.timestamp;
                const date = ts && ts._seconds ? new Date(ts._seconds * 1000) : null;
                return date && date >= last24h && date <= now;
            });
        } else {
            // Filter by selectedDate
            filtered = filtered.filter(item => {
                const ts = item.timestamp;
                const date = parseTimestamp(ts);
                const itemDateStr = date?.toISOString().split("T")[0];
                return itemDateStr === selectedDate;
            });
        }

        return filtered;
    } catch (error) {
        console.error("Error fetching inverter data:", error);
        return [];
    }
};


const handlePrint = () => {
  window.print(); // simple browser print functionality
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
              <div className="dropdown-item" onClick={() => navigate('/Profile', {state: {userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess}})}>
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

        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Generate Chart</h2>

          <div className="chart-controls">
              <div className="control-group">
                <label>Select Date:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>

              <div className="control-group">
                <label>Select Inverter:</label>
                <select value={Inverters} onChange={(e) => setInverters(e.target.value)}>
                
                  <option value="INV001">INV001</option>
                  <option value="INV003">INV003</option>
                </select>
              </div>

              <div className="control-group">
                <label>X Axis:</label>
                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
<option value="solarpower">Power</option>
<option value="voltage">Voltage</option>
<option value="current">Current</option>
<option value="frequency">Frequency</option>
<option value="time">Time</option>
                </select>
              </div>

              <div className="control-group">
                <label>Y Axis:</label>
                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
<option value="solarpower">Power</option>
<option value="voltage">Voltage</option>
<option value="current">Current</option>
<option value="frequency">Frequency</option>
<option value="time">Time</option>
                </select>
              </div>

              <div className="button-container">
                <button onClick={handleGenerateChart}>Generate Chart</button>
                 <button className="print-button" onClick={handlePrint}>Print</button>
              </div>
            </div>

            {showChart && (
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </section>
        </main>
      </div>
    </div>
  );
}
