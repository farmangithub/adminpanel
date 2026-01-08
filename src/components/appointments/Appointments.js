import { ref, onValue, update } from "firebase/database";
import { database } from "../../friendFirebase"; // ✅ Use named import
import React, { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch patients to map userId → name
  useEffect(() => {
    const patientsRef = ref(database, "users/patients"); // ✅ use database
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const map = {};
      for (let uid in data) {
        map[uid] = data[uid].name || "Unknown Patient";
      }
      setPatientMap(map);
    });
  }, []);

  // Fetch appointments
  useEffect(() => {
    const appointmentsRef = ref(database, "appointments"); // ✅ use database
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const tempAppointments = [];

      for (const userId in data) {
        const userAppointments = data[userId] || {};
        for (const appointmentId in userAppointments) {
          const apt = userAppointments[appointmentId];
          tempAppointments.push({
            id: appointmentId,
            userId,
            patientName: patientMap[userId] || "Unknown Patient",
            doctorName: apt.doctorName || "N/A",
            start: apt.start || "N/A",
            end: apt.end || "N/A",
            status: apt.status || "Pending",
            timestamp: apt.timestamp || null,
          });
        }
      }

      setAppointments(tempAppointments);
      setLoading(false);
    });
  }, [patientMap]);

  const approveAppointment = (userId, appointmentId) => {
    const aptRef = ref(database, `appointments/${userId}/${appointmentId}`);
    update(aptRef, { status: "Approved" });
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} style={{ backgroundColor: "#fff" }}>
                <td style={tdStyle}>{apt.patientName}</td>
                <td style={tdStyle}>{apt.doctorName}</td>
                <td style={tdStyle}>{apt.start}</td>
                <td style={tdStyle}>{apt.end}</td>
                <td
                  style={{
                    ...tdStyle,
                    color:
                      apt.status.toLowerCase() === "approved"
                        ? "green"
                        : apt.status.toLowerCase() === "pending"
                        ? "orange"
                        : "red",
                    fontWeight: "600",
                  }}
                >
                  {apt.status}
                </td>
                <td style={tdStyle}>
                  {apt.status === "Pending" ? (
                    <button
                      onClick={() => approveAppointment(apt.userId, apt.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "green",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                  ) : (
                    <span>—</span>
                  )}
                </td>
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
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

export default Appointments;
