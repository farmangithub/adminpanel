import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert("Verification email sent! Please check your inbox or spam.");
      await signOut(auth);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        border: "2px solid red",
        borderRadius: "10px",
        padding: "30px",
        width: "320px",
        margin: "100px auto",
        boxShadow: "0 4px 12px rgba(255, 0, 0, 0.2)",
        backgroundColor: "#fff5f5",
        textAlign: "center",
      }}
    >
      <form onSubmit={handleSignup}>
        <h2 style={{ color: "red", fontWeight: "bold", fontStyle: "italic" }}>
          Signup
        </h2>

        <label style={{ color: "blue", fontWeight: "bold", fontStyle: "italic" }}>
          Email
        </label>
        <br />
        <input
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            margin: "8px 0",
            padding: "8px",
            width: "90%",
            fontSize: "14px",
          }}
        />
        <br />

        <label style={{ color: "blue", fontWeight: "bold", fontStyle: "italic" }}>
          Password
        </label>
        <br />
        <input
          type="password"
          placeholder="Enter password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            margin: "8px 0",
            padding: "8px",
            width: "90%",
            fontSize: "14px",
          }}
        />
        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "15px",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
