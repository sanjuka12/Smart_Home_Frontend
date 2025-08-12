import { useLocation } from 'react-router-dom';
import './Profile.css';
import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 



import { FaTachometerAlt, FaChartBar, FaSolarPanel, FaTools, FaUsers, FaCog, FaQuestionCircle, FaUserCircle, FaBell, FaSignOutAlt, FaEdit, FaCheck, FaEye, FaEyeSlash, FaLocationArrow } from 'react-icons/fa';

export default function Profile() {

  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;
  const firstName = location.state?.firstName;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const [profileData, setProfileData] = useState({
  name: '',
  email: '',
  role: '',
  password: '',
  invAccess: '',
});

useEffect(() => {
  if (username) {
    axios
      .get(`http://localhost:3000/users/${encodeURIComponent(username)}`)
      .then(res => {
        const data = res.data;
        setProfileData({
          name: data.firstName || '',
          email: data.userName || '',
          role: data.role || '',
          password: data.password || '',
          invAccess:data.inverterAccess|| '',
        });
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      });
  }
}, [username]);


  const handleLogout = () => {
  // clear tokens or session here if any
  navigate('/Loginpage');
};

  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showChangeOptions, setShowChangeOptions] = useState(false);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [picOptionsOpen, setPicOptionsOpen] = useState(false);


const togglePicOptions = () => setPicOptionsOpen(!picOptionsOpen);
  const fileInputRef = useRef(null);

  const handleEditClick = (field) => {
    setEditingField(field);
    setEditedValue(profileData[field]);
  };

  const handleSaveClick = (field) => {
    setProfileData({ ...profileData, [field]: editedValue });
    setEditingField(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, profilePic: reader.result }));
        setShowChangeOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleRemoveImage = () => {
    setProfileData(prev => ({ ...prev, profilePic: '' }));
    setShowChangeOptions(false);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="dashboard-container">
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
              <div className="dropdown-item"><FaUserCircle className="dropdown-icon" /> Profile</div>
              <div className="dropdown-item"><FaCog className="dropdown-icon" /> Settings</div>
              <div className="dropdown-item"><FaSignOutAlt className="dropdown-icon" /> Logout</div>
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
            <h2 className="section-title">User Profile</h2>
            <div className="profile-section">
 <div className="profile-picture-container">
  {profileData.profilePic ? (
    <img src={profileData.profilePic} alt="Profile" className="profile-picture" />
  ) : (
    <div className="profile-placeholder">Add Photo</div>
  )}

  <div className="change-pic-wrapper">
    <button className="edit-pic-label" onClick={() => setShowPicOptions(!showPicOptions)}>
      Change
    </button>

    {showPicOptions && (
      <div className="pic-options-dropdown">
        <label htmlFor="upload" className="pic-option">
          Upload New Image
          <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>
        <label className="pic-option remove-option" onClick={handleRemoveImage}>
          Remove Image
        </label>
      </div>
    )}
  </div>
</div>


              {['name', 'email', 'role', 'password', 'invAccess'].map(field => (
                <div className="profile-row" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  {editingField === field ? (
                    <>
                      <input
                        type={field === 'password' && !showPassword ? 'password' : 'text'}
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                      />
                      {field === 'password' && (
                        showPassword ? (
                          <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(false)} />
                        ) : (
                          <FaEye className="eye-icon" onClick={() => setShowPassword(true)} />
                        )
                      )}
                      <FaCheck className="edit-icon" onClick={() => handleSaveClick(field)} />
                    </>
                  ) : (
                    <>
                      <span>{field === 'password' ? '●●●●●●●●' : profileData[field]}</span>
                      <FaEdit className="edit-icon" onClick={() => handleEditClick(field)} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}