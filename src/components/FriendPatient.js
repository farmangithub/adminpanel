import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../friendFirebase";

function FriendPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientsRef = ref(friendDatabase, "users/patients");

    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const patientList = Object.entries(data).map(([id, patient]) => ({
          id,
          ...patient,
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
      <h2>🧑‍🤝‍🧑 List of Patients</h2>
      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        patients.map((patient) => (
          <div
            key={patient.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <h3>{patient.name || "N/A"}</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {Object.entries(patient).map(([key, value]) => {
                if (key === "id" || key === "name") return null; // skip id and name here
                return (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                    {value ? value.toString() : "N/A"}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendPatient;
