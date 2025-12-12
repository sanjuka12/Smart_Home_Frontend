// src/EnergyAnalysis.js
import React, { useEffect, useState } from "react";
import "./IAMMeterDashboard.css"; // Reuse existing styles

export default function EnergyAnalysis({UnitId}) {

const apiUrl = process.env.REACT_APP_API_URL;

 const [energy, setEnergy] = useState("0.00");

  useEffect(() => {
    const fetchTodayEnergy = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/today-energy?UnitId=${UnitId}`
        );
        const data = await res.json();
        setEnergy(data.energyToday || "N/A");
      } catch (error) {
        console.error("Error fetching today's energy", error);
      }
    };

    fetchTodayEnergy();
  }, [UnitId]);


    return (
      <div className="energy-analysis-container">
        <h2 className="light-blue-rectangle">Energy Analysis</h2>
  
        <div className="energy-card-wrapper">
          <div className="energy-card large-card green-card">
            <p className="card-main">{energy} kWh</p>
            <p>Net Generation</p>
          </div>
  
          <div className="small-card-column">
            <div className="energy-card small-card blue-card">
              <p className="small-card-main">{energy} kWh</p>
              <p>Exported Energy</p>
            </div>
            <div className="energy-card small-card red-card">
              <p className="small-card-main">0.00 kWh</p>
              <p>Load Consumption</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  