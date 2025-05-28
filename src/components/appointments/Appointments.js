import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../../friendFirebase";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentsRef = ref(friendDatabase, "appointments");

    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      const tempAppointments = [];

      if (data) {
        Object.entries(data).forEach(([userId, userAppointments]) => {
          Object.entries(userAppointments).forEach(([appointmentId, apt]) => {
            tempAppointments.push({
              id: appointmentId,
              userId: userId,
              doctorName: apt.doctorName || "N/A",
              consultationType: apt.consultationType || "N/A",
              day: apt.day || "N/A",
              start: apt.start || "N/A",
              end: apt.end || "N/A",
              timestamp: apt.timestamp
                ? new Date(apt.timestamp).toLocaleString()
                : "N/A",
            });
          });
        });
      }

      setAppointments(tempAppointments);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Appointment ID</th>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Doctor Name</th>
              <th style={thStyle}>Consultation Type</th>
              <th style={thStyle}>Day</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td style={tdStyle}>{apt.id}</td>
                <td style={tdStyle}>{apt.userId}</td>
                <td style={tdStyle}>{apt.doctorName}</td>
                <td style={tdStyle}>{apt.consultationType}</td>
                <td style={tdStyle}>{apt.day}</td>
                <td style={tdStyle}>{apt.start}</td>
                <td style={tdStyle}>{apt.end}</td>
                <td style={tdStyle}>{apt.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f0f0f0",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default Appointments;
