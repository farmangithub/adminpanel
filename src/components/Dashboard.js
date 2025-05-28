import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../friendFirebase"; // Adjust path if needed

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper function to format day from date string or timestamp
function getDayOfWeek(dateOrTimestamp) {
  const date = typeof dateOrTimestamp === "number" ? new Date(dateOrTimestamp) : new Date(dateOrTimestamp);
  return daysOfWeek[date.getDay()];
}

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontWeight="600"
      fontSize={13}
    >
      <tspan x={x} dy="-0.6em">{name}</tspan>
      <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from Firebase
  useEffect(() => {
    const appointmentsRef = ref(friendDatabase, "appointments");

    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      const tempAppointments = [];

      if (data) {
        // Your data structure is appointments/{userId}/{appointmentId}/appointmentData
        Object.entries(data).forEach(([userId, userAppointments]) => {
          Object.entries(userAppointments).forEach(([appointmentId, apt]) => {
            tempAppointments.push({
              id: appointmentId,
              userId,
              doctorName: apt.doctorName || "N/A",
              consultationType: apt.consultationType || "N/A",
              day: apt.day || "N/A",
              start: apt.start || "N/A",
              end: apt.end || "N/A",
              timestamp: apt.timestamp || null,
              status: apt.status || "Pending", // Assuming you have a status field (Completed, Cancelled, Pending)
              patientName: apt.patientName || "N/A", // If you have patientName in appointment
            });
          });
        });
      }

      setAppointments(tempAppointments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Prepare Pie chart data for status counts
  const statusCounts = appointments.reduce(
    (acc, apt) => {
      const s = apt.status.toLowerCase();
      if (s.includes("completed")) acc.Completed += 1;
      else if (s.includes("cancelled")) acc.Cancelled += 1;
      else acc.Pending += 1;
      return acc;
    },
    { Completed: 0, Pending: 0, Cancelled: 0 }
  );

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Prepare Line chart data for appointments per day of the week
  const appointmentsByDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  appointments.forEach((apt) => {
    let dayKey = apt.day;

    // If day stored as string (like "Mon"), use it, else get from timestamp
    if (!daysOfWeek.includes(dayKey)) {
      if (apt.timestamp) dayKey = getDayOfWeek(apt.timestamp);
      else dayKey = "N/A";
    }
    if (appointmentsByDay[dayKey] !== undefined) appointmentsByDay[dayKey]++;
  });

  // Convert to array in order of week days Mon-Sun
  const lineData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    appointments: appointmentsByDay[day] || 0,
  }));

  // Sort today's appointments by start time (optional)
  const today = new Date().toLocaleDateString();
  const todaysAppointments = appointments.filter((apt) => {
    // You can adjust logic depending on how day is stored
    return apt.day === today || new Date(apt.timestamp).toLocaleDateString() === today;
  }).sort((a,b) => a.start.localeCompare(b.start));

  return (
    <div style={{ padding: "20px", maxWidth: 1000, margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Welcome to the Admin Dashboard</h1>

      <section style={{ marginBottom: 50 }}>
        <h3 style={{ marginBottom: 20, color: "#555" }}>Appointment Status Pie Chart</h3>
        {loading ? <p>Loading chart...</p> : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({index, ...rest}) => renderCustomizedLabel({ ...rest, index, name: pieData[index].name })}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="#eee"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}
              />
              <Legend verticalAlign="bottom" height={36} iconSize={14} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>

      <section style={{ marginBottom: 50 }}>
        <h3 style={{ marginBottom: 20, color: "#555" }}>Weekly Appointment Schedule</h3>
        {loading ? <p>Loading chart...</p> : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={lineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}
                cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#0088FE"
                strokeWidth={3}
                activeDot={{ r: 8, strokeWidth: 2, stroke: "#005bb5" }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      <section>
        <h3 style={{ marginBottom: 20, color: "#555" }}>Today's Appointment Schedule</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Doctor</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(({ id, start, patientName, doctorName, status }, idx) => (
                <tr
                  key={id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                    transition: "background-color 0.3s",
                  }}
                >
                  <td style={tdStyle}>{start || "N/A"}</td>
                  <td style={tdStyle}>{patientName || "N/A"}</td>
                  <td style={tdStyle}>{doctorName || "N/A"}</td>
                  <td
                    style={{
                      ...tdStyle,
                      color: status === "Completed" ? "green" : status === "Pending" ? "orange" : "red",
                      fontWeight: "600",
                    }}
                  >
                    {status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px 15px",
  textAlign: "left",
  fontWeight: "700",
  color: "#444",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px 15px",
  color: "#555",
  fontSize: "14px",
};
