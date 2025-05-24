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

      // Sign out so user cannot proceed before verification
      await signOut(auth);

      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSignup}
      style={{
        textAlign: "center",
        marginTop: 100,
        color: "red",
        fontWeight: "bold",
        fontStyle: "italic",
      }}
    >
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: 10, padding: 10, width: 250 }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: 10, padding: 10, width: 250 }}
      />
      <br />
      <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
