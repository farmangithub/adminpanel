import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../friendFirebase";

const AddDoctor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !category) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const doctorsRef = ref(database, "users/doctors");
      const newDoctorRef = push(doctorsRef);

      // Set doctor data with proper services structure
      await set(newDoctorRef, {
        name,
        email,
        createdAt: Date.now(),
        services: {
          eyecare: {
            "service-offered": category,
            "id-proof": false,
            "selfie-with-id": null, // Initially null
            "verification-status": "Not Verified", // Important for admin verification
            token: null,
          },
        },
      });

      setMessage("Doctor added successfully!");
      setName("");
      setEmail("");
      setCategory("");
    } catch (error) {
      setMessage("Error adding doctor: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Add Doctor</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter doctor name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter doctor email"
          />
        </div>
        <div>
          <label>Category / Service:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter service category"
          />
        </div>
        <br />
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
