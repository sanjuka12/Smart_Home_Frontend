import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import axios from 'axios';
import './AddInverter.css';
import {
  FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools,
  FaUsers, FaCog, FaQuestionCircle, FaUserCircle,
  FaBell, FaSignOutAlt, FaLocationArrow
} from 'react-icons/fa';

export default function AddInverter() {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const username = location.state?.userName;
  const firstName = location.state?.firstName;
  const role = location.state?.role;
  const inverterAccess = location.state?.inverterAccess;
  const locationData = location.state?.selectedLocation;
  const previousData = location.state?.newInverterData;

  const apiUrl = process.env.REACT_APP_API_URL;
   
const defaultPosition = [6.9271, 79.8612]; 

  const [inverterData, setInverterData] = useState({
    id: '',
    brand: '',
    generationType: 'on-grid',
    capacity: '',
    location: '',
    latitude: '',
    longitude: '',
    address: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
  // clear tokens or session here if any
  navigate('/Loginpage');
};

  useEffect(() => {
    // Load previous form data if coming back from map
    if (previousData) {
      setInverterData(prev => ({ ...prev, ...previousData }));
    }
    // Auto fill lat, lng, and closest city if returned from map
    if (locationData) {
      setInverterData(prev => ({
        ...prev,
        latitude: locationData.lat,
        longitude: locationData.lng,
        location: locationData.city,
      }));
    }
  }, [locationData, previousData]);

  const handleChange = (e) => {
    setInverterData({
      ...inverterData,
      [e.target.name]: e.target.value,
    });
  };

const handleRedirectToMap = () => {
  if (!inverterData.id.trim() || !inverterData.brand.trim() || !inverterData.capacity.trim()) {
    alert("Please fill Inverter ID, Brand, and Capacity before selecting a location.");
    return;
  }
  navigate('/DeviceMap', {
    state: { username, firstName, newInverterData: inverterData }
  });
};


  const handleSaveInverter = async () => {
    // Validation
    const requiredFields = ['id', 'brand', 'capacity', 'address'];
    for (const field of requiredFields) {
      if (!inverterData[field] || inverterData[field].trim() === '') {
        alert(`Please complete the "${field}" field.`);
        return;
      }
    }

    if (!inverterData.latitude || !inverterData.longitude) {
      alert('Please select a location on the map to set latitude and longitude.');
      return;
    }

    const latNum = parseFloat(inverterData.latitude);
    const lngNum = parseFloat(inverterData.longitude);
    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('Latitude and Longitude must be valid numbers.');
      return;
    }

    try {
      const postData = {
        UnitId: inverterData.id.trim(),
        Name: inverterData.brand.trim(),
        Type: inverterData.generationType,
        Location: inverterData.location,
        Latitude: latNum.toString(),
        Longitude: lngNum.toString(),
        Address: inverterData.address.trim(),
        InstalledCapacity: inverterData.capacity.trim(),
        Power: "Waiting",
        Status: "Waiting"
      };

      const response = await axios.post(`${apiUrl}/addinverter`, postData);

      if (response.status === 200 || response.status === 201) {
        alert('✅ Inverter added successfully!');
        navigate('/DeviceMap', { state: { username, firstName } });
      } else {
        alert('❌ Failed to add inverter.');
      }
    } catch (error) {
      console.error('Add inverter error:', error);
      alert('❌ Error adding inverter: ' + (error.response?.data?.message || error.message));
    }
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

        {/* Main */}
        <main className="dashboard-main">
          <section className="yield-section add-inverter-section">
            <h2 className="section-title">Add New Inverter</h2>
            <form className="add-inverter-form" onSubmit={e => e.preventDefault()}>
              <input type="text" name="id" placeholder="Inverter ID" value={inverterData.id} onChange={handleChange} required />
              <input type="text" name="brand" placeholder="Inverter Brand" value={inverterData.brand} onChange={handleChange} required />

              <select name="generationType" value={inverterData.generationType} onChange={handleChange} required>
                <option value="on-grid">On-Grid</option>
                <option value="off-grid">Off-Grid</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <input type="text" name="capacity" placeholder="Generation Capacity (kW)" value={inverterData.capacity} onChange={handleChange} required />

              <div className="location-row">
                <input type="text" name="location" placeholder="Closest City" value={inverterData.location} readOnly />
                <button type="button" className="map-button" onClick={handleRedirectToMap}>Select on Map</button>
              </div>

              <input type="text" name="latitude" placeholder="Latitude" value={inverterData.latitude} readOnly />
              <input type="text" name="longitude" placeholder="Longitude" value={inverterData.longitude} readOnly />

              <input type="text" name="address" placeholder="Address (Required)" className="full-width" value={inverterData.address} onChange={handleChange} required />

              <button type="button" className="save-button" onClick={handleSaveInverter}>
                Add Inverter
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
