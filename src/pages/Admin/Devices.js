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
import { io } from "socket.io-client";


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

const Devices = () => {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const inverterId = location.state?.inverterId;
  const inverterName = location.state?.inverterName;

  const apiUrl = process.env.REACT_APP_API_URL;

  const [batteryPercentage, setBatteryPercentage] = useState(0); // or any initial value

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [solarData, setSolarData] = useState(null);
  const [batteryData, setBatteryData] = useState(null);
  const solarMax = 5000; // example max power
  const batteryMax = 100;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/Loginpage');
  };

  //Communication with the help of the database...

//  const fetchInverterData = async () => {
//   try {
//     const res = await axios.get(`http://localhost:3000/livedata/${inverterId}`);
//     console.log('Fetched inverter live data:', res.data);

//     // Example assuming res.data structure matches these fields:
//     setSolarData({
//       gridStatus: mapGridStatus(res.data.gridStatus),
//       voltage: res.data.voltage,
//       current: res.data.current,
//       frequency: res.data.frequency,
//       solarpower:res.data.solarpower,
//     });




//     setBatteryPercentage(res.data.batteryPercentage || 0); // update battery %
//   } catch (err) {
//     console.error('Failed to fetch data:', err);
//   }
// };


// const fetchBatteryData = async () => {
//   try {
//     const res = await axios.get(`http://localhost:3000/realtimebatterydata/${inverterId}`);
//     console.log('Fetched battery live data:', res.data);

//     setBatteryData({
//       gridStatus: mapBatteryStatus(res.data.gridStatus),
//       voltage: res.data.voltage,
//       current: res.data.current,
//       power: res.data.power,
//       soc: res.data.soc,
//       timestamp: res.data.timestamp,
//     });
//   } catch (error) {
//     console.error('Error fetching battery live data:', error);
//   }
// };

 useEffect(() => {
  if (!inverterId) return;

  // const socket = io(`${apiUrl}`, {
  //   transports: ["websocket"], // ensure WebSocket transport
  // });

  //const socket = io("http://147.93.30.1:3000", { transports: ["websocket"] });


  const socket = io("http://147.93.30.1:3000", { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");

    // Tell server which inverter to subscribe to
    socket.emit("subscribe", inverterId);
  });

  socket.on("newData", (liveData) => {
    console.log("Received live data:", liveData);

    if (liveData.UnitId !== inverterId) return; // safety check

    if (liveData.type === "solar") {
      setSolarData({
        gridStatus: liveData.gridStatus,
        voltage: liveData.voltage,
        current: liveData.current,
        frequency: liveData.frequency,
        solarpower: liveData.power*1000,
      });
    }

    if (liveData.type === "battery") {
      setBatteryData({
        gridStatus: liveData.gridStatus,
        voltage: liveData.voltage,
        current: liveData.current,
        power: liveData.power,
        soc: liveData.soc,
        timestamp: liveData.timestamp,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
  });

  return () => {
    socket.disconnect();
  };
}, [inverterId]);


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
              <div className="dropdown-item" onClick={() => navigate('/Profile', {state: {userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess}})}>
                <FaUserCircle className="dropdown-icon" />
                Profile
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
            <h2 className="section-title">Devices / Inverters</h2>

            <div className="device-cards-container">
              {/* Solar Inverter Card */}
              <div className="device-card">
                <h2 style={{ color: '#0B048E' }}>Solar Inverter</h2>
                <p className="status-text connected">Connected</p>

                <div className="gauge">
                  <div className="gauge-chart">
                    <CircularProgressbar
                      value={solarData?.solarpower}
                      maxValue={solarMax}
                      text={`${solarData?.solarpower?.toFixed(0) || 0} W`}

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
                      value={batteryData?.soc || 0}
                      maxValue={batteryMax}
                      text={`${batteryData?.soc?.toFixed(0) || 0} %`}
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

                <div className="info-row">
    <span>Status</span>
    <span className="badge" style={{ color: 'green', fontWeight: 'bold' }}>
      {batteryData?.gridStatus || "N/A"}
    </span>
  </div>
  <div className="info-row">
    <span>Battery Voltage</span>
    <span>{batteryData?.voltage ? `${batteryData.voltage} V` : "N/A"}</span>
  </div>
  <div className="info-row">
    <span>Battery Current</span>
    <span>{batteryData?.current ? `${batteryData.current} A` : "N/A"}</span>
  </div>
  <div className="info-row">
    <span>Battery Power</span>
    <span>{batteryData?.power ? `${batteryData.power} W` : "N/A"}</span>
  </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Devices;

