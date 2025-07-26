import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './DeviceMap.css';

import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaLocationArrow } from 'react-icons/fa';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// const DefaultIcon = L.icon({
//   iconUrl,
//   shadowUrl: iconShadowUrl,
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;


const redIcon = new L.Icon({
  iconUrl: '/assets/redarrow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = redIcon;


export default function DeviceMap() {
  const location = useLocation();
  const username = location.state?.username;
  const firstName = location.state?.firstName;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inverters, setInverters] = useState([]);
  const [newInverter, setNewInverter] = useState({ name: '', lat: '', lng: '' });

  useEffect(() => {
    const saved = localStorage.getItem('inverterList');
    if (saved) {
      setInverters(JSON.parse(saved));
    } else {
      const defaultInverters = [
        { id: 1, name: 'Inverter A', lat: 7.2906, lng: 80.6337 },
        { id: 2, name: 'Inverter B', lat: 6.9271, lng: 79.8612 },
      ];
      setInverters(defaultInverters);
      localStorage.setItem('inverterList', JSON.stringify(defaultInverters));
    }
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
  // clear tokens or session here if any
  navigate('/Loginpage');
};

  const handleAddInverter = (e) => {
    e.preventDefault();
    if (!newInverter.name || !newInverter.lat || !newInverter.lng) return;

    const id = Date.now();
    const updated = [
      ...inverters,
      {
        id,
        name: newInverter.name,
        lat: parseFloat(newInverter.lat),
        lng: parseFloat(newInverter.lng),
      },
    ];

    setInverters(updated);
    localStorage.setItem('inverterList', JSON.stringify(updated));
    setNewInverter({ name: '', lat: '', lng: '' });
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
            <NavLink to="/devices" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaSolarPanel className="sidebar-icon" /> Devices / Inverters</NavLink>
            <NavLink to="/Maintenance" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaTools className="sidebar-icon" /> Maintenance / Alerts</NavLink>
            <NavLink to="/Users" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaUsers className="sidebar-icon" /> Users / Roles</NavLink>
            <NavLink to="/Settings" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaCog className="sidebar-icon" /> Settings</NavLink>
            <NavLink to="/support" state={{ userName: username, firstName: firstName }} className="sidebar-link"><FaQuestionCircle className="sidebar-icon" /> Support / Help</NavLink>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="yield-section">
            <h2 className="section-title">Device Map</h2>

            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {inverters.map((inv) => (
                <Marker key={inv.id} position={[inv.lat, inv.lng]}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{inv.name}</strong><br />
                      <button onClick={() => handleMarkerClick(inv)}>View</button>
                      <br />
                      <button onClick={() => handleDeleteInverter(inv.id)}>Delete</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <form className="add-inverter-form" onSubmit={handleAddInverter}>
              <h3>Add New Inverter</h3>
              <input
                type="text"
                placeholder="Name"
                value={newInverter.name}
                onChange={(e) => setNewInverter({ ...newInverter, name: e.target.value })}
                required
              />
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={newInverter.lat}
                onChange={(e) => setNewInverter({ ...newInverter, lat: e.target.value })}
                required
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={newInverter.lng}
                onChange={(e) => setNewInverter({ ...newInverter, lng: e.target.value })}
                required
              />
              <button type="submit">Add Inverter</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
