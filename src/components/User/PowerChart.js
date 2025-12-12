import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function PowerChart({UnitId}) {
  const [chartData, setChartData] = useState([]);

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
        
        // Filter based on UnitId
        const filtered = resp.data.filter(
          item => item.UnitId === UnitId
        );

        // Build chart-friendly format
        const formatted = filtered.map(item => ({
          time: parseTimestamp(item.timestamp),
          inverter: Number(item.solarpower || 0),
          feedin: Number(item.feedin || 0),       // <-- CHANGE TO YOUR FIELD NAME
          load: Number(item.load || 0)            // <-- CHANGE TO YOUR FIELD NAME
        }));

        setChartData(formatted);

      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [UnitId]);

  return (
    <div className="power-chart-container">
      <h2 className="light-blue-rectangle">Power Flow Analytics</h2>
      <div className="chart-box" style={{ width: "500px", height: "130px" }}>
        <ResponsiveContainer width="85%" height={170}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "15px" }} align="center" />

            <Line type="monotone" dataKey="inverter" stroke="#ed5565" name="Inverter Power" dot={false} />
            <Line type="monotone" dataKey="feedin" stroke="#388e3c" name="Net Export" dot={false} />
            <Line type="monotone" dataKey="load" stroke="#4a89dc" name="Load Power" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
