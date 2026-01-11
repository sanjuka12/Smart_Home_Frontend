import { useLocation, NavLink } from 'react-router-dom';
import './LoadFlow_User.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow, FaSearch
} from 'react-icons/fa';

export default function LoadFlow_User() {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const inverterId = inverterAccess; // <-- this is invaccess

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inverterDropdownOpen, setInverterDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInverter, setSelectedInverter] = useState({
    name: 'INV001',
    type: 'Hybrid'
  });

  const [recentInverters, setRecentInverters] = useState([
    { name: 'INV001', type: 'Hybrid' },
    { name: 'INV002', type: 'Off-grid' },
    { name: 'INV003', type: 'On-grid' }
  ]);

  const [solarData, setSolarData] = useState({
  gridStatus: false,
  voltage: 0,
  current: 0,
  frequency: 0,
  solarpower: 0,
});



  useEffect(() => {
  if (!inverterId) return;

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
  setSystemData(prev => ({
    ...prev,

    // LOAD ON/OFF STATUS
    loads: [
      liveData.loadstatus1 === 1,
      liveData.loadstatus2 === 1,
      liveData.loadstatus3 === 1,
      prev.loads[3] // keep Load 4 unchanged if exists
    ],

    // LOAD POWER VALUES (convert current → kW if needed)
    loadsPower: [
      Number(liveData.current1 || 0),
      Number(liveData.current2 || 0),
      Number(liveData.current3 || 0),
      prev.loadsPower[3]
    ],

    // battery flow logic (optional but recommended)
    batteryOnline: true,
    batteryDischarging: liveData.power > 0,
    batteryCharging: liveData.power < 0,
  }));
}

  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
  });

  return () => {
    socket.disconnect();
  };
}, [inverterId]);




  const navigate = useNavigate();

  const [systemData, setSystemData] = useState({
    gridActive: true,
    solarActive: true,
    batteryOnline: true,
    switchClosed: true,
    batteryCharging: false,
    batteryDischarging: true,
    loads: [false, false, false, false],
    loadsPower: [0, 0, 0, 0],
  });

  const toggleDropdown = () => setDropdownOpen(v => !v);
  const toggleInverterDropdown = () => setInverterDropdownOpen(v => !v);



  const busbarEnergized =
    systemData.gridActive ||
    systemData.solarActive ||
    (systemData.batteryOnline && systemData.switchClosed && systemData.batteryDischarging);

  const flow = {
    gridToBusbar: systemData.gridActive,
    solarToBusbar: systemData.solarActive,
    acInFromBusbar: systemData.gridActive,
    acOutToBusbar: !systemData.gridActive && systemData.batteryDischarging,
    loads: systemData.loads.map(l => l && busbarEnergized)
  };

  const COLORS = {
    on: '#4caf50',
    off: '#f44336',
    busbar: '#f0ad4e',
    border: '#2b2b2b',
    feeder: '#374151',
  };
  const nodeFill = (isOn) => (isOn ? COLORS.on : COLORS.off);

  const filteredInverters = recentInverters.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInverterSelect = (inv) => {
    setSelectedInverter(inv);
    setInverterDropdownOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <img src="/assets/Dashboard.png" alt="Solar Icon" className="dashboard-icon" />
          <span style={{ marginLeft: 10 }}>SUNWIZ Solar Monitoring System</span>
        </h1>
        <div className="user-profile">
          <FaBell className="notification-icon" />
          <span className="user-name">{firstName}</span>
          <FaUserCircle className="profile-icon" />
          <span className="dropdown-arrow" onClick={toggleDropdown}>▼</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/Profile_User', {state: {userName: username, firstName: firstName, role:role, inverterAccess:inverterAccess}})}>
                              <FaUserCircle className="dropdown-icon" />
                              Profile
                            </div>
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item"><FaSignOutAlt className="dropdown-icon" /> Logout</div>
            </div>
          )}
        </div>
      </header>

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

        {/* SCADA + Legends */}
        <div className="scada-wrapper">
          <div className="scada-stage">
            {selectedInverter.type === 'On-grid' ? (
              <div className="no-loadflow">
                <p style={{ fontSize: '18px', textAlign: 'center', color: '#555' }}>
                  ⚡ This is an <strong>On-grid inverter</strong>. Load flow diagram is not required.
                </p>
              </div>
            ) : (
              <svg className="scada-svg" viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrowSolid" markerWidth="14" markerHeight="10" refX="11" refY="5" orient="auto">
                    <path d="M0,0 L0,10 L12,5 z" fill="#111" />
                  </marker>
                  <marker id="arrowGray" markerWidth="14" markerHeight="10" refX="11" refY="5" orient="auto">
                    <path d="M0,0 L0,10 L12,5 z" fill="#9ca3af" />
                  </marker>
                </defs>

                {/* BUSBAR */}
                <line x1="250" y1="262" x2="1090" y2="262" className="busbar-line" stroke={COLORS.busbar} />

                {/* Grid */}
                <rect x="40" y="40" width="150" height="60" rx="12" ry="12"
                  fill={nodeFill(systemData.gridActive)} stroke={COLORS.border} strokeWidth="2" />
                <text x="115" y="78" className="node-label" textAnchor="middle">Grid</text>

                {/* Solar inverter */}
                <rect x="950" y="40" width="190" height="60" rx="12" ry="12"
                  fill={nodeFill(systemData.solarActive)} stroke={COLORS.border} strokeWidth="2" />
                <text x="1045" y="78" className="node-label" textAnchor="middle">Solar inverter</text>
                <line x1="1045" y1="100" x2="1045" y2="262"
                  className={`feeder ${flow.solarToBusbar ? 'energized' : 'deenergized'}`}
                  stroke={COLORS.feeder}
                  markerEnd={flow.solarToBusbar ? 'url(#arrowSolid)' : 'url(#arrowGray)'} />

                {/* Battery inverter */}
                <rect x="505" y="392" width="290" height="90" rx="16" ry="16"
                  fill={nodeFill(systemData.batteryOnline)} stroke={COLORS.border} strokeWidth="2" />
                <text x="650" y="422" className="node-label" textAnchor="middle">Battery inverter</text>
                <text x="530" y="452" className="port-label">AC IN</text>
                <text x="770" y="452" className="port-label" textAnchor="end">AC OUT</text>

                {/* AC IN */}
                <polyline
                  points="115,100 115,320 565,320 565,392"
                  className={`feeder ${flow.acInFromBusbar ? 'energized' : 'deenergized'}`}
                  stroke={COLORS.feeder}
                  fill="none"
                  markerEnd={flow.acInFromBusbar ? 'url(#arrowSolid)' : 'url(#arrowGray)'}
                />

                {/* AC OUT */}
                <polyline
                  points="750,392 750,262"
                  className={`feeder ${flow.acOutToBusbar ? 'energized-up' : 'deenergized'}`}
                  stroke={COLORS.feeder}
                  fill="none"
                  markerEnd={flow.acOutToBusbar ? 'url(#arrowSolid)' : 'url(#arrowGray)'}
                />

                {/* Loads */}
                {[280, 480, 820, 1020].map((Lx, i) => (
                  <g key={i}>
                    <line x1={Lx} y1="262" x2={Lx} y2="622"
                      className={`feeder ${flow.loads[i] ? 'energized' : 'deenergized'}`}
                      stroke={COLORS.feeder}
                      markerEnd={flow.loads[i] ? 'url(#arrowSolid)' : 'url(#arrowGray)'} />
                    <rect x={Lx - 70} y="622" width="180" height="60" rx="12" ry="12"
                      fill={nodeFill(systemData.loads[i])} stroke={COLORS.border} strokeWidth="2" />
                    <text x={Lx} y="654" className="node-label" textAnchor="middle">
                      Load {i + 1}: {systemData.loads[i] ? 'ON' : 'OFF'}
                    </text>
                    <text x={Lx} y="674" className="node-label" textAnchor="middle" fontSize="14px">
                      {systemData.loadsPower[i]} kW
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          {/* Legends & Select Inverter */}
          <div className="legend-container">
            <div className="select-inverter-container">
              <button className="select-inverter-btn" onClick={toggleInverterDropdown}>
                Select Inverter ▾
              </button>
              {inverterDropdownOpen && (
                <div className="inverter-dropdown">
                  <div className="inverter-search">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search inverter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ul className="inverter-list">
                    {filteredInverters.map((inv, i) => (
                      <li key={i} onClick={() => handleInverterSelect(inv)}>
                        {inv.name} <span className="type-tag">{inv.type}</span>
                      </li>
                    ))}
                    {filteredInverters.length === 0 && (
                      <li className="no-result">No inverters found</li>
                    )}
                  </ul>
                </div>
              )}
              <div className="selected-info">
                Selected: <strong>{selectedInverter.name}</strong> ({selectedInverter.type})
              </div>
            </div>

            <div className="legend-box">
              <h3>Legend</h3>
              <div className="legend-item"><span className="legend-swatch on" /> ON</div>
              <div className="legend-item"><span className="legend-swatch off" /> OFF</div>
              <div className="legend-item"><span className="legend-swatch busbar" /> Busbar</div>
              <div className="legend-item"><span className="legend-flow energized"></span> Energized feeder</div>
              <div className="legend-item"><span className="legend-flow deenergized"></span> De-energized feeder</div>
            </div>

            <div className="legend-box power-legend">
              <h3>Load Power Consumption</h3>
              {systemData.loadsPower.map((power, i) => (
                <div className="legend-item" key={i}>
                  <span className={`legend-swatch ${systemData.loads[i] ? 'on' : 'off'}`} />
                  Load {i + 1}: {power} kW
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
