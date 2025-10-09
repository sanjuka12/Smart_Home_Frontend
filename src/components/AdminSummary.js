import "./AdminSummary.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSummary() {
  // State for live summary from backend
  const [summary, setSummary] = useState({
    totalItems: 0,
    overallCapacity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchInverterSummary = async () => {
      try {
        const res = await axios.get(`${apiUrl}/inverters/summary`); // adjust URL/port
        setSummary({
          totalItems: res.data.totalItems,
          overallCapacity: res.data.overallCapacity
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch inverter summary:", err);
        setError("Could not load inverter summary");
        setLoading(false);
      }
    };

    fetchInverterSummary();
  }, []);

  // Build summary rows dynamically
  const summaryData = [
    { label: "Total Installed Solar Capacity", value: `${summary.overallCapacity} kW` },
    { label: "Number of Solar Inverters", value: summary.totalItems },
    { label: "Active Solar Inverters", value: "1,050" },              // Optional static
    { label: "Daily Total Solar Generation", value: "1.8 GWh" },     // Optional static
    { label: "Daily Peak Solar Generation", value: "320 MW" },       // Optional static
  ];

  if (loading) return <div>Loading summary...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-summary-card-container">
      <h3 className="admin-light-blue-rectangle">Generation Summary</h3>
      <div className="admin-summary-table">
        {summaryData.map((item, index) => (
          <div className="admin-summary-row" key={index}>
            <span className="admin-summary-label">{item.label}</span>
            <span className="admin-summary-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
