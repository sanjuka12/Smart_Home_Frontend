import React, { useState,useEffect, useRef} from "react";
import "./Available_Inverter.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaTrashAlt, FaLocationArrow } from 'react-icons/fa';
import axios from "axios";
import io from "socket.io-client";
import DeviceSearch from "./DeviceSearch";

export default function Available_Inverter() {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const dropdownRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;

const mapGridStatus = (statusText) => {
  const statusMap = {
    "OFF": { color: "gray" },
    "Sleep": { color: "gray" },
    "Starting": { color: "blue" },
    "Generating": { color: "green" },
    "Throttled": { color: "orange" },
    "Shutting Down": { color: "purple" },
    "Waiting": { color: "Red" },
    "Fault": { color: "red" },
    "Flash": { color: "red" },
    "Standby": { color: "gold" }
  };

  return statusMap[statusText] || { color: "black" }; // default color if unknown
};

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
const navigate = useNavigate();

const [showSearchPopup, setShowSearchPopup] = useState(false);

  const [inverters, setInverters] = useState([]);

  const handleAddInverter = () => {
    navigate('/AddInverter', { state: { username, firstName, role, inverterAccess } });
  };


    const handleDataLog = () => {
    navigate('/DataLog', { state: { username, firstName, role, inverterAccess } });
  };

    const handleSearchInverter = () => {
    setShowSearchPopup(true); // open popup
  };

  const handleClosePopup = () => {
    setShowSearchPopup(false); // close popup
  };


const handleLogout = () => {
  // clear tokens or session here if any
  navigate('/Loginpage');
};

useEffect(() => {
  const fetchInverters = async () => {
    try {
      const res = await axios.get(`${apiUrl}/listInverters`);

      // Keep only static fields, initialize live fields with defaults
      const inverterList = res.data.map(inv => ({
        UnitId: inv.UnitId,
        Name: inv.Name,
        Type: inv.Type,
        Location: inv.Location,
        Status: "Waiting", // default empty
        Power: 0  ,   // default empty
        InstalledCapacity: inv.InstalledCapacity,
      }));

      setInverters(inverterList);
    } catch (err) {
      console.error('Error fetching inverter data:', err);
    }
  };

  fetchInverters();
}, []);

//fetching data from web sockets without involvement of the DB

  useEffect(() => {
    if (inverters.length === 0) return;

    const socket = io(`${apiUrl}`, { transports: ["websocket"] });

    socket.on("connect", () => console.log("✅ Connected to WebSocket"));

    // subscribe each inverter id
    
    inverters.forEach((inv) => {
      socket.emit("subscribe", inv.UnitId);
    });
  
    // when live data comes, update only that row
    socket.on("newData", (liveData) => {
  setInverters((prev) =>
    prev.map((inv) =>
      inv.UnitId === liveData.UnitId && liveData.type === "solar"
        ? {
            ...inv,
            Status: liveData.gridStatus || inv.Status,
            Generation: liveData.power ? liveData.power * 1000 : inv.Generation,
          }
        : inv
    )
  );
});

    socket.on("disconnect", () => console.log("❌ WebSocket disconnected"));

    return () => socket.disconnect();
  }, [inverters]);



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
                    <div className="dropdown-menu" ref={dropdownRef}>
              <div className="dropdown-item" onClick={() => navigate('/Profile', {state: {userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess}})}>
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
            <h2 className="section-title">Inverter List</h2>

            {/* Add Button */}
          <div className="add-inverter-container">

                      <button className="delete-button" onClick={handleAddInverter}>
            Delete
            </button>
             <button className="secondary-button" onClick={handleSearchInverter}>
            Search
            </button>
             {showSearchPopup && <DeviceSearch onClose={handleClosePopup} />}

           
           <button className="console-button " onClick={handleDataLog}>
            Data Logs
            </button>

      <button className="add-inverter-button" onClick={handleAddInverter}>
         <span className="plus-sign">+</span>Add Inverter
          </button>
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
                      <th>Generation (w)</th>
                      <th>Installed Capacity(kw)</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inverters.map((inv, idx) => (
                      <tr key={idx}>
                        <td>{inv.UnitId}</td>
                        <td>{inv.Name}</td>
                        <td>{inv.Type}</td>
                        <td>{inv.Location}</td>
<td style={{ verticalAlign: "middle", padding: "8px 10px" }}>
  <span
    className={inv.Status === "Generating" ? "blinking-square" : ""}
    style={{
      display: "inline-block",
      width: "12px",
      height: "12px",
      borderRadius: "3px",
      backgroundColor: mapGridStatus(inv.Status).color,
      marginRight: "6px",
      verticalAlign: "middle",
    }}
  ></span>
  <span style={{ verticalAlign: "middle" }}>{inv.Status}</span>
</td>
                       <td>
                          {inv.Generation} <span style={{ marginLeft: "4px" }}>W</span>
                      </td>
                       <td>
                          {inv.InstalledCapacity} <span style={{ marginLeft: "4px" }}>kW</span>
                      </td>
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
