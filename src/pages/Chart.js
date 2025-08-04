import React, { useState } from "react";
import "./Chart.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaTachometerAlt, FaLocationArrow } from 'react-icons/fa';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip);

export default function Chart() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

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

  const handleGenerateChart = () => {
    if (!Inverters) {
    setErrorMessage("⚠️ Please select an inverter type.");
    return;
    }

    if (xAxis === yAxis) {
    setErrorMessage("⚠️ X-axis and Y-axis cannot be the same.");
    return;
    } 

    setErrorMessage(""); // Clear error if inputs are valid
  
    if (!xAxis || !yAxis) return;


    const labels = Array.from({ length: 10 }, (_, i) => `${xAxis} ${i + 1}`);
    const dataPoints = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

    setChartData({
      labels,
      datasets: [
        {
          label: `${yAxis}`,
          data: dataPoints,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `${yAxis.toUpperCase()} vs ${xAxis.toUpperCase()} Chart`,
        },
      },
      scales: {
        x: { title: { display: true, text: `${xAxis.toUpperCase()}` } },
        y: { title: { display: true, text: `${yAxis.toUpperCase()}` } },
      },
    });

    setShowChart(true);
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
            <h2 className="section-title">Generate Chart</h2>

            <div className="chart-controls">
                <div className="axis-group">
                    <label>Select Inverter: </label>
                    <select value={Inverters} onChange={(e) => setInverters(e.target.value)}><option value="">Select</option>
                        <option value="001">001</option>
                        <option value="002">002</option>
                    </select>
                </div>

                <div className="axis-group">
                    <label htmlFor="xAxis">X Axis:</label>
                    <select id="xAxis" value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                        <option value="">Select</option>
                        <option value="voltage">Voltage</option>
                        <option value="current">Current</option>
                        <option value="power">Power</option>
                        <option value="energy">Energy</option>
                    </select>
                </div>

                <div className="axis-group">
                    <label htmlFor="yAxis">Y Axis:</label>
                    <select id="yAxis" value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                        <option value="">Select</option>
                        <option value="voltage">Voltage</option>
                        <option value="current">Current</option>
                        <option value="power">Power</option>
                        <option value="energy">Energy</option>
                    </select>
                </div>
            </div>
            
            <div className="button-container">
                <button onClick={handleGenerateChart}>Generate Chart</button>
            </div>
              
        
             
            {showChart && (
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

            {errorMessage && (<p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>)}


          </section>
        </main>
      </div>
    </div>
  );
}
