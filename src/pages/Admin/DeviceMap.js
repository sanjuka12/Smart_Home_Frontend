import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import './DeviceMap.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

// Icon for inverters on map
const inverterIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/assets/inverter-icon.png',
  iconSize: [25, 25],
  iconAnchor: [17, 45],
  popupAnchor: [0, -40],
});

// Icon for temporary selected location when adding new inverter
const tempIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/assets/temp-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle map clicks for selecting a location
function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function DeviceMap() {
  const location = useLocation();
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inverters, setInverters] = useState([]);
  const [tempLocation, setTempLocation] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  // This holds data for new inverter if passed during navigation
  const newInverterData = location.state?.newInverterData || null;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    navigate('/Loginpage');
  };

  const handleAddInverterClick = () => {
    navigate('/AddInverter', { state: { username, firstName, role, inverterAccess } });
  };

  const handleDeleteInverter = (id) => {
    const updated = inverters.filter((inv) => inv.id !== id);
    setInverters(updated);
    localStorage.setItem('inverterList', JSON.stringify(updated));
  };

  // Called when user clicks on the map while adding new inverter
  const handleMapClick = (latlng) => {
    if (newInverterData) {
      setTempLocation(latlng);
    }
  };

  // Confirm location button handler: reverse geocode and navigate
  const confirmLocation = async () => {
    if (!tempLocation || !newInverterData) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${tempLocation.lat}&lon=${tempLocation.lng}&format=json`
      );
      const data = await response.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        'Unknown';

      navigate('/AddInverter', {
        state: {
          username,
          firstName,
          newInverterData,
          selectedLocation: {
            lat: tempLocation.lat,
            lng: tempLocation.lng,
            city,
          },
        },
      });
    } catch (error) {
      console.error('Reverse geocoding failed', error);
      alert('Failed to get city name. Please try again.');
    }
  };

  const handleAddInverter = () => {
    navigate('/AddInverter', { state: { username, firstName } });
  };

    const handleDataLog = () => {
    navigate('/DataLog', { state: { username, firstName } });
  };

  // Fetch inverter list from backend once on component mount
  useEffect(() => {
    const fetchInverters = async () => {
      try {
        const res = await axios.get(`${apiUrl}/listInverters`);
        const formatted = res.data.map(inv => ({
          ...inv,
          lat: parseFloat(inv.Latitude),
          lng: parseFloat(inv.Longitude),
          name: inv.Name,
        }));
        setInverters(formatted);
      } catch (err) {
        console.error('Error fetching inverter data:', err);
      }
    };

    fetchInverters();
  }, []);

  const handleMarkerClick = (inv) => {
    navigate('/devices', {
      state: {
        inverterId: inv.UnitId,
        inverterName: inv.name,
        username,
        firstName,
        role,
        inverterAccess
      },
    });
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
            <h2 className="section-title">Device Map</h2>

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
              center={[6.0383, 80.3909]}
              zoom={9}
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

              {/* Enable clicking on map only if adding a new inverter */}
              {newInverterData && <LocationSelector onSelect={handleMapClick} />}

              {/* Show temporary marker for the location selection */}
              {newInverterData && tempLocation && (
                <Marker position={[tempLocation.lat, tempLocation.lng]} icon={tempIcon}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>Confirm this location?</strong><br />
                      <button onClick={confirmLocation}>Confirm Location</button>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Display all existing inverter markers */}
              {inverters.map((inv) => (
                <Marker key={inv.id} position={[inv.lat, inv.lng]} icon={inverterIcon}>
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{inv.UnitId}</strong><br />
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
