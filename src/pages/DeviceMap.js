import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './DeviceMap.css';

import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const inverterIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/assets/inverter-icon.png',
  iconSize: [25, 25],
  iconAnchor: [17, 45],
  popupAnchor: [0, -40],
});

export default function DeviceMap() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inverters, setInverters] = useState([]);

  useEffect(() => {
 
      const defaultInverters = [
        { id: 1, name: 'Inverter A', lat: 6.0486, lng: 80.5211 },
        { id: 2, name: 'Inverter B', lat: 6.0320, lng: 80.2168 },
      ];
      setInverters(defaultInverters);
      localStorage.setItem('inverterList', JSON.stringify(defaultInverters));
    
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleMarkerClick = (inverter) => {
    navigate('/devices', {
      state: {
        inverterId: inverter.id,
        inverterName: inverter.name,
        username,
        firstName,
      },
    });
  };

  const handleLogout = () => {
    navigate('/Loginpage');
  };

  const handleAddInverterClick = () => {
    navigate('/AddInverter', { state: { username, firstName } });
  };

  const handleDeleteInverter = (id) => {
    const updated = inverters.filter((inv) => inv.id !== id);
    setInverters(updated);
    localStorage.setItem('inverterList', JSON.stringify(updated));
  };

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
            {/* Centered title */}
            <h2 className="section-title">Device Map</h2>

            {/* Add Inverter button below title with reduced margin */}
            <div className="add-inverter-button-container">
              <button
                onClick={handleAddInverterClick}
                className="add-inverter-button"
                title="Add New Inverter"
              >
                + Add Inverter
              </button>
            </div>

            <MapContainer
              center={[6.0535, 80.2200]}
              zoom={12}
              minZoom={6}
              maxBounds={[[5.85, 79.6], [9.85, 82.1]]}
              maxBoundsViscosity={1.0}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {inverters.map((inv) => (
                <Marker key={inv.id} position={[inv.lat, inv.lng]} icon={inverterIcon}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{inv.id}</strong><br />
                      <button onClick={() => handleMarkerClick(inv)}>View</button><br />
                      <button onClick={() => handleDeleteInverter(inv.id)}>Delete</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </section>
        </main>
      </div>
    </div>
  );
}
