import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import friendDatabase from "../friendFirebase"; // Adjust import if default export

function FriendDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorsRef = ref(friendDatabase, "users/doctors");

    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Doctors data from friend Firebase:", data);

      if (data) {
        // data here is an object of doctorId -> doctorData
        const doctorList = Object.entries(data).map(([id, doctor]) => ({
          id,
          ...doctor,
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
      <h2>👨‍⚕️ List of Doctors</h2>
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map((doc) => (
            <li key={doc.id} style={{ marginBottom: "10px" }}>
              <strong>Name:</strong> {doc.name || "N/A"} <br />
              <strong>Specialty:</strong> {doc.specialty || "N/A"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendDoctor;
