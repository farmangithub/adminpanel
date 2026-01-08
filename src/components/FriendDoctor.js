import React, { useEffect, useState } from "react";
import { ref as dbRef, onValue, update } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { database, friendStorage } from "../friendFirebase"; // ✅ adjust path

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorsRef = dbRef(database, "users/doctors");
    onValue(doctorsRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const doctorList = await Promise.all(
        Object.entries(data).map(async ([id, doc]) => {
          let idProofUrl = null;

          // Fetch ID proof image from Firebase Storage
          const idPath = doc.services?.eyecare?.["id-proof"];
          if (idPath) {
            try {
              idProofUrl = await getDownloadURL(storageRef(friendStorage, idPath));
            } catch (err) {
              console.log("Error fetching ID image:", err);
            }
          }

          return {
            id,
            name: doc.name || "N/A",
            email: doc.email || "N/A",
            category: doc.services?.eyecare?.["service offered"] || doc.category || "N/A",
            verificationStatus: doc.services?.eyecare?.["verification-status"] || "Not Verified",
            idProofUrl,
          };
        })
      );
      setDoctors(doctorList);
      setLoading(false);
    });
  }, []);

  // Handle verifying doctor
  const handleVerify = (doctorId) => {
    const doctorStatusRef = dbRef(database, `users/doctors/${doctorId}/services/eyecare/verification-status`);
    update(doctorStatusRef, "Verified")
      .then(() => {
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === doctorId ? { ...doc, verificationStatus: "Verified" } : doc
          )
        );
      })
      .catch((err) => console.log("Error verifying doctor:", err));
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👨‍⚕️ Doctors</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>ID Proof</th>
            <th style={thStyle}>Verification Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td style={tdStyle}>{doc.name}</td>
              <td style={tdStyle}>{doc.category}</td>
              <td style={tdStyle}>{doc.email}</td>
              <td style={tdStyle}>
                {doc.idProofUrl ? (
                  <img
                    src={doc.idProofUrl}
                    alt="ID Proof"
                    style={{ width: 100, borderRadius: 5 }}
                  />
                ) : (
                  "No ID Uploaded"
                )}
              </td>
              <td style={tdStyle}>{doc.verificationStatus}</td>
              <td style={tdStyle}>
                {doc.verificationStatus !== "Verified" && doc.idProofUrl ? (
                  <button onClick={() => handleVerify(doc.id)}>Verify</button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default Doctors;
