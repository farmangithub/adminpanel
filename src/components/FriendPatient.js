import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../friendFirebase"; // ✅ Correct import

function FriendPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientsRef = ref(database, "users/patients");

    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientList = Object.entries(data).map(([id, pat]) => ({
          id,
          name: pat.name || "N/A",
          email: pat.email || "N/A",
          verified: pat.verified || false,
        }));
        setPatients(patientList);
      } else {
        setPatients([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧑‍🤝‍🧑 Patients (Admin Panel)</h2>
      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Verified</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pat) => (
              <tr key={pat.id}>
                <td style={tdStyle}>{pat.name}</td>
                <td style={tdStyle}>{pat.email}</td>
                <td style={tdStyle}>{pat.verified ? "✅ Verified" : "❌ Pending"}</td>
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

export default FriendPatient;
