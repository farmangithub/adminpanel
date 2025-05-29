import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        navigate('/dashboard');
      } else {
        alert('Please verify your email before logging in.');
        await auth.signOut();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        border: '2px solid red',
        borderRadius: '10px',
        padding: '30px',
        width: '320px',
        margin: '100px auto',
        boxShadow: '0 4px 12px rgba(255, 0, 0, 0.2)',
        backgroundColor: '#fff5f5',
        textAlign: 'center',
      }}
    >
      <form onSubmit={handleLogin}>
        <h2 style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>Login</h2>

        <label style={{ color: 'blue', fontWeight: 'bold', fontStyle: 'italic' }}>
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
            margin: '8px 0',
            padding: '8px',
            width: '90%',
            fontSize: '14px',
          }}
        />
        <br />

        <label style={{ color: 'blue', fontWeight: 'bold', fontStyle: 'italic' }}>
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
            margin: '8px 0',
            padding: '8px',
            width: '90%',
            fontSize: '14px',
          }}
        />
        <br />

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '15px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <p style={{ marginTop: '15px' }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: 'blue' }}>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
