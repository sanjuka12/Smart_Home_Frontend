// AdminSummaryCard.js
import React from "react";
import "./AdminSummary.css";

export default function AdminSummary() {
  // Example data (replace with real backend values later)
  const summaryData = [
    { label: "Total Installed Solar Capacity", value: "250 MW" },
    { label: "Number of Solar Inverters", value: "1,200" },
    { label: "Active Solar Inverters", value: "1,050" },
    { label: "Daily Total Solar Generation", value: "1.8 GWh" },
    { label: "Daily Peak Solar Generation", value: "320 MW" },
  ];

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
