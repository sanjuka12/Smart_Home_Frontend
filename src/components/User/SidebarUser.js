import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartBar,
  FaLocationArrow,
  FaSolarPanel,
  FaUsers,
  FaTools,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import "./SidebarUser.css"; // optional styling file

export default function SidebarUser({ username, firstName, role, inverterAccess }) {
  return (
    <aside className="dashboard-sidebar">
      <h2 className="sidebar-title">All Places</h2>
      <nav className="sidebar-nav">
        <NavLink
          to={role === "Administrator" ? "/AdminDashboard" : "/dashboard"}
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaTachometerAlt className="sidebar-icon" /> Dashboard
        </NavLink>

        <NavLink
          to="/analytics1_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaChartBar className="sidebar-icon" /> Analytics / Reports
        </NavLink>

        <NavLink
          to="/Devices_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaLocationArrow className="sidebar-icon" /> Generation Status
        </NavLink>

        <NavLink
          to="/Available_Inverter_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaSolarPanel className="sidebar-icon" /> Inverter Status
        </NavLink>

        <NavLink
          to="/LoadFlow_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaUsers className="sidebar-icon" /> Load Management
        </NavLink>

        <NavLink
          to="/Maintenance_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaTools className="sidebar-icon" /> Maintenance / Alerts
        </NavLink>

        <NavLink
          to="/Settings_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaCog className="sidebar-icon" /> Settings
        </NavLink>

        <NavLink
          to="/support_User"
          state={{ userName: username, firstName, role, inverterAccess }}
          className="sidebar-link"
        >
          <FaQuestionCircle className="sidebar-icon" /> Support / Help
        </NavLink>
      </nav>
    </aside>
  );
}
