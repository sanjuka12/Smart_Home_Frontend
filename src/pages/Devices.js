import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';
import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./Devices.css";

const Devices = () => {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [solarData, setSolarData] = useState(null);
  const [solarpower, setSolarPower] = useState(0);
  const solarMax = 5000; // example max power

  const [batteryPercentage, setBatteryPercentage] = useState(80); // dummy
  const batteryMax = 100;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/Loginpage');
  };

 useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:3000/livedata")
        .then(response => {
          if (response.data.length > 0) {
            const latest = response.data[0];
setSolarData(latest);
setSolarPower(Number(latest.solarpower) || 0);

          }
        })
        .catch(error => console.error("Fetch error:", error));
    };

    fetchData(); // initial load

    const interval = setInterval(fetchData, 1000); // fetch every 1 second

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  return (
    <div className="dashboard-container">
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
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item" onClick={handleLogout}><FaSignOutAlt className="dropdown-icon" /> Logout</div>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">All Places</h2>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTachometerAlt className="sidebar-icon" /> Dashboard</NavLink>
            <NavLink to="/analytics1" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaChartBar className="sidebar-icon" /> Analytics / Reports</NavLink>
            <NavLink to="/inverterMap" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaLocationArrow className="sidebar-icon" /> Inverter Map</NavLink>
            <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
            <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
            <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
            <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
            <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Devices / Inverters</h2>

            <div className="device-cards-container">
              {/* Solar Inverter Card */}
              <div className="device-card">
                <h2 style={{ color: '#0B048E' }}>Solar Inverter</h2>
                <p className="status-text connected">Connected</p>

                <div className="gauge">
                  <div className="gauge-chart">
                    <CircularProgressbar
                      value={solarpower}
                      maxValue={solarMax}
                      text={`${solarpower.toFixed(2)} kW`}
                      styles={buildStyles({
                        textSize: 16,
                        pathColor: "#6006B6",
                        textColor: "#000",
                        trailColor: "#e5e7eb",
                      })}
                    />
                  </div>
                  <p className="gauge-label">Output Power</p>
                </div>

                <div className="info-row">
                  <span>Status</span>
                  <span className="badge" style={{ color: '#048F25', fontWeight: 'bold' }}>
                    {solarData?.gridStatus || "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <span>AC Voltage</span>
                  <span>{solarData?.voltage ? solarData.voltage + " V" : "N/A"}</span>
                </div>
                <div className="info-row">
                  <span>AC Current</span>
                  <span>{solarData?.current ? solarData.current + " A" : "N/A"}</span>
                </div>
                <div className="info-row">
                  <span>Frequency</span>
                  <span>{solarData?.frequency ? solarData.frequency + " Hz" : "N/A"}</span>
                </div>
              </div>

              {/* Battery Inverter Card */}
              <div className="device-card">
                <h2 style={{ color: '#0B048E' }}>Battery Inverter</h2>
                <p className="status-text connected">Connected</p>

                <div className="gauge">
                  <div className="gauge-chart">
                    <CircularProgressbar
                      value={batteryPercentage}
                      maxValue={batteryMax}
                      text={`${batteryPercentage.toFixed(2)} %`}
                      styles={buildStyles({
                        textSize: 16,
                        pathColor: "#9203AB",
                        textColor: "#000",
                        trailColor: "#e5e7eb",
                      })}
                    />
                  </div>
                  <p className="gauge-label">Battery Percentage</p>
                </div>

                <div className="info-row"><span>Status</span><span className="badge" style={{ color: 'green', fontWeight: 'bold' }}>Charging</span></div>
                <div className="info-row"><span>Battery Voltage</span><span>54 V</span></div>
                <div className="info-row"><span>Charging Current</span><span>0.1 A</span></div>
                <div className="info-row"><span>Battery Power</span><span>30 W</span></div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Devices;

