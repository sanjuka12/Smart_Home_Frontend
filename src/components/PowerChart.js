import React from "react";
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

const data = [
  { time: "03:00", inverter: 0, feedin: -1000, load: 2000 },
  { time: "06:00", inverter: 5000, feedin: -2000, load: 3000 },
  { time: "09:00", inverter: 9000, feedin: -4000, load: 5000 },
  { time: "12:00", inverter: 11000, feedin: -6000, load: 6000 },
  { time: "15:00", inverter: 8000, feedin: -3000, load: 5000 },
];

export default function PowerChart() {
  return (
    <div className="power-chart-container">
      <h2 className="light-blue-rectangle">Power Flow Analytics</h2>
      <div className="chart-box" style={{ width: '500px' ,height:'130px'}}>
        <ResponsiveContainer width="85%" height={170}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }}/>
            <Tooltip />
            <Legend 
  wrapperStyle={{ fontSize: '15px' }} 
  align="center"
/>

            <Line type="monotone" dataKey="inverter" stroke="#ed5565" name="Inverter Power" />
            <Line type="monotone" dataKey="feedin" stroke="#388e3c" name="Net Export" />
            <Line type="monotone" dataKey="load" stroke="#4a89dc" name="Load Power" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
