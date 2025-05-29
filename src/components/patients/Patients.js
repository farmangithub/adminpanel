import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../../friendFirebase"; // Your Firebase Realtime DB instance

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientsRef = ref(friendDatabase, "users/patients");

    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const patientList = Object.entries(data).map(([id, pat]) => {
          let profilePic = pat["profile-picture"] || null;

          // If profilePic is raw base64 without data URI, prepend the prefix
          if (profilePic && !profilePic.startsWith("data:image/")) {
            profilePic = `data:image/png;base64,${profilePic}`;
          }

          return {
            id,
            name: pat.name || "N/A",
            email: pat.email || "N/A",
            profilePicture: profilePic,
            profileStatus: profilePic
              ? "✅ Profile Picture Updated"
              : "❌ Profile Picture Not Updated",
          };
        });
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
      <h2>🧑‍🤝‍🧑 Patients</h2>
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
              <th style={thStyle}>Profile Picture</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pat) => (
              <tr key={pat.id}>
                <td style={tdStyle}>{pat.name}</td>
                <td style={tdStyle}>{pat.email}</td>
                <td style={tdStyle}>
                  {pat.profilePicture ? (
                    <img
                      src={pat.profilePicture}
                      alt="Profile"
                      style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                    />
                  ) : (
                    "No Picture"
                  )}
                </td>
                <td style={tdStyle}>{pat.profileStatus}</td>
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

export default Patients;
