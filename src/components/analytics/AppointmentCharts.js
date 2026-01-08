// src/components/appointments/AppointmentCharts.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { database } from "../friendFirebase"; // ✅ Correct import

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function AppointmentCharts() {
  const [chartData, setChartData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const appointmentsRef = ref(database, "appointments"); // ✅ updated here
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appointmentArray = Object.values(data);

        // Pie chart: count consultation types
        const consultationCount = {};
        // Line chart: appointments by day
        const dayCount = {};

        appointmentArray.forEach((apt) => {
          // Count by consultation type
          const type = apt.consultationType || "Unknown";
          consultationCount[type] = (consultationCount[type] || 0) + 1;

          // Count by day
          const day = apt.day || "Unknown";
          dayCount[day] = (dayCount[day] || 0) + 1;
        });

        const pieData = Object.entries(consultationCount).map(([name, value]) => ({ name, value }));
        const lineDataFormatted = Object.entries(dayCount).map(([day, count]) => ({ day, count }));

        setChartData(pieData);
        setLineData(lineDataFormatted);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Appointment Statistics</h2>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div>
          <h3>Consultation Type Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div>
          <h3>Appointments per Day</h3>
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCharts;
