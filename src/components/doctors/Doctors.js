import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../friendFirebase"; // ✅ Correct relative path

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorsRef = ref(database, "users/doctors");

    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const doctorList = Object.entries(data).map(([id, doc]) => ({
          id,
          name: doc.name || "N/A",
          category: doc.category || "N/A",
          email: doc.email || "N/A",
          idProof: doc["id-proof"] ? "✅ Verified" : "❌ No ID",
        }));
        setDoctors(doctorList);
      } else {
        setDoctors([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👨‍⚕️ Doctors</h2>
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>ID Verification</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td style={tdStyle}>{doc.name}</td>
                <td style={tdStyle}>{doc.category}</td>
                <td style={tdStyle}>{doc.email}</td>
                <td style={tdStyle}>{doc.idProof}</td>
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

export default Doctors;
