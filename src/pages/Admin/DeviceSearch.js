import React, { useState, useEffect } from "react";
import "./DeviceSearch.css";
import { FaArrowUp } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;

const DeviceSearch = ({ onClose }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [newDevices, setNewDevices] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);

  useEffect(() => {
    // Step 1: Fetch all registered inverter IDs from DB
    const fetchRegistered = async () => {
      try {
        const res = await axios.get(`${apiUrl}/listInverters`);
        const ids = res.data.map(inv => inv.UnitId);
        setRegisteredIds(ids);
      } catch (err) {
        console.error("❌ Error fetching inverter list:", err);
      }
    };

    fetchRegistered();
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setNewDevices([]); // clear old results

    // Step 2: Connect to WebSocket
    const socket = io(apiUrl, { transports: ["websocket"] });

    const detectedIds = new Set();

    socket.on("connect", () => console.log("✅ Connected to WebSocket for search"));

    socket.on("newData", (data) => {
      if (data?.UnitId && data?.type === "solar") {
        // If the ID is not in DB and not already detected
        if (!registeredIds.includes(data.UnitId) && !detectedIds.has(data.UnitId)) {
          detectedIds.add(data.UnitId);
          setNewDevices(prev => [...prev, data.UnitId]);
        }
      }
    });

    // Step 3: Stop search after 4s
    setTimeout(() => {
      setIsSearching(false);
      socket.disconnect();
      if (detectedIds.size === 0) {
        alert("✅ No new devices found nearby!");
      } else {
        alert(`✅ New inverters found: ${[...detectedIds].join(", ")}`);
      }
      onClose();
    }, 4000);
  };

  return (
    <div className="device-search-overlay">
      <div className="device-search-container">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2 className="popup-title">Searching for Nearby Devices</h2>

        <div className={`search-wheel ${isSearching ? "rotate" : ""}`}>
          <FaArrowUp className="center-icon" />
        </div>

        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Start Search"}
        </button>

        {/* Optional display of found devices */}
        {newDevices.length > 0 && (
          <div className="found-list">
            <h4>🆕 New Devices Detected:</h4>
            <ul>
              {newDevices.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSearch;
