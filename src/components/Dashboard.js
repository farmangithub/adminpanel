import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../friendFirebase";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FF8042']; // Blue, Green, Orange
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const [patients, setPatients] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patients data
  useEffect(() => {
    const patientsRef = ref(friendDatabase, "users/patients");
    onValue(patientsRef, (snapshot) => {
      setPatients(snapshot.val() || {});
    });
  }, []);

  // Fetch appointments and merge with patients
  useEffect(() => {
    if (Object.keys(patients).length === 0) return;

    const appointmentsRef = ref(friendDatabase, "appointments");
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const mergedAppointments = [];

      for (const userId in data) {
        if (!data.hasOwnProperty(userId)) continue;

        const userAppointments = data[userId];
        for (const appointmentId in userAppointments) {
          if (!userAppointments.hasOwnProperty(appointmentId)) continue;

          const apt = userAppointments[appointmentId];
          mergedAppointments.push({
            id: appointmentId,
            userId,
            patientName: patients[userId]?.name || "Unknown Patient",
            doctorName: apt.doctorName || "Unknown Doctor",
            consultationType: apt.consultationType || "N/A",
            day: apt.day || "N/A",
            start: apt.start || "N/A",
            end: apt.end || "N/A",
            status: apt.status || "Pending",
            timestamp: apt.timestamp || null,
          });
        }
      }

      setAppointments(mergedAppointments);
      setLoading(false);
    });
  }, [patients]);

  // Prepare PieChart data for statuses
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

  // Prepare LineChart data for appointments by day (Mon-Sun order)
  const appointmentsByDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  appointments.forEach((apt) => {
    let dayKey = apt.day;
    if (!daysOfWeek.includes(dayKey)) {
      if (apt.timestamp) dayKey = daysOfWeek[new Date(apt.timestamp).getDay()];
      else dayKey = "N/A";
    }
    if (appointmentsByDay[dayKey] !== undefined) appointmentsByDay[dayKey]++;
  });

  const lineData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    appointments: appointmentsByDay[day] || 0,
  }));

  if (loading) return <div>Loading data from Firebase...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Admin Dashboard</h1>

      {/* Pie Chart Section */}
      <section style={{ marginBottom: 50 }}>
        <h3 style={{ marginBottom: 20, color: "#555" }}>Appointment Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="#eee"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Line Chart Section */}
      <section style={{ marginBottom: 50 }}>
        <h3 style={{ marginBottom: 20, color: "#555" }}>Weekly Appointments Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" allowDecimals={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="appointments" stroke="#00C49F" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Appointments Table */}
      <section>
        <h3 style={{ marginBottom: 20, color: "#555" }}>All Appointments</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
              <th style={thStyle}>Patient Name</th>
              <th style={thStyle}>Doctor Name</th>
              <th style={thStyle}>Day</th>
              <th style={thStyle}>Start Time</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(({ id, patientName, doctorName, day, start, status }, idx) => (
              <tr
                key={id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                  transition: "background-color 0.3s",
                }}
              >
                <td style={tdStyle}>{patientName}</td>
                <td style={tdStyle}>{doctorName}</td>
                <td style={tdStyle}>{day}</td>
                <td style={tdStyle}>{start}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: status.toLowerCase() === "completed" ? "green" : status.toLowerCase() === "pending" ? "orange" : "red",
                    fontWeight: "600",
                  }}
                >
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
