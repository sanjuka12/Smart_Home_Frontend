import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminPowerChart.css";

export default function AdminPowerChart({ inverterAccess }) {
  const [chartData, setChartData] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState(inverterAccess || "INV001");
  const [inverters, setInverters] = useState(["INV001", "INV003"]); // example inverter list

  // Convert Firestore timestamp
  const parseTimestamp = (ts) => {
    if (!ts) return "";
    if (ts._seconds) {
      const d = new Date(ts._seconds * 1000);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${process.env.REACT_APP_API_URL}/solarinverterdata`);
        const filtered = resp.data.filter(item => item.UnitId === selectedInverter);

        const formatted = filtered.map(item => ({
          time: parseTimestamp(item.timestamp),
          inverter: Number(item.solarpower || 0),
          feedin: Number(item.feedin || 0),
          load: Number(item.load || 0),
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [selectedInverter]);

  return (
    <div className="admin-power-chart-container">
      <h2 className="admin-light-blue-rectangle">Power Flow Analytics</h2>

      {/* Dropdown above chart */}
      <div className="inverter-dropdown" style={{ marginBottom: "5%" }}>
        <label>Select Inverter: </label>
        <select
          value={selectedInverter}
          onChange={(e) => setSelectedInverter(e.target.value)}
          style={{ marginLeft: "1rem", padding: "2px 6px", borderRadius: "4px" }}
        >
          {inverters.map(inv => (
            <option key={inv} value={inv}>{inv}</option>
          ))}
        </select>
      </div>

      <div className="admin-chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: "0.7rem" }} />
            <YAxis tick={{ fontSize: "0.7rem" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} align="center" verticalAlign="top" />
            <Line type="monotone" dataKey="inverter" stroke="#ed5565" name="Inverter Power" dot={false} />
            <Line type="monotone" dataKey="feedin" stroke="#388e3c" name="Net Export" dot={false} />
            <Line type="monotone" dataKey="load" stroke="#4a89dc" name="Load Power" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
